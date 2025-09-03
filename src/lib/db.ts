import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import crypto from 'crypto';

// Let's declare a global variable to hold the database connection.
let db: Database<sqlite3.Database, sqlite3.Statement>;

// This function will initialize the database connection.
async function initializeDatabase() {
    try {
        const dbPath = path.join(process.cwd(), 'iris.db');
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('[DB] Connected to the SQLite database.');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                operatorId TEXT PRIMARY KEY,
                accessKey TEXT NOT NULL UNIQUE,
                securityLevel TEXT NOT NULL,
                token TEXT,
                tokenExpires TEXT
            );
        `);
        
        console.log('[DB] Users table is ready.');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS system_state (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
        `);

        console.log('[DB] System state table is ready.');
        
        await db.exec(`
          CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            eventType TEXT NOT NULL,
            operatorId TEXT,
            details TEXT,
            signature TEXT
          );
        `);
        
        console.log('[DB] Audit log table is ready.');


        // Add a default user if they don't exist
        const defaultUser = await db.get('SELECT * FROM users WHERE operatorId = ?', 'Operator-7');
        if (!defaultUser) {
            await db.run(
                'INSERT INTO users (operatorId, accessKey, securityLevel) VALUES (?, ?, ?)',
                'Operator-7',
                'IRIS-Ut9OWLLQWhB#FEc6awCLdLlZrSUh$WGzLHpvvCbY', // Pre-defined key
                '7' // Admin level
            );
            console.log('[DB] Default admin user "Operator-7" created.');
        }

        // Set initial lockdown state if not present
        const lockdownState = await db.get('SELECT * FROM system_state WHERE key = ?', 'lockdown_level');
        if (!lockdownState) {
            await setSystemState('lockdown_level', 'NONE');
            console.log('[DB] Initial lockdown level set to NONE.');
        }


    } catch (error) {
        console.error('[DB_ERROR] Error initializing database', error);
        throw error; // Propagate the error to crash the app if DB fails
    }
}

// Immediately call the initialization function.
// Using a top-level await is fine in modern Node.js modules.
initializeDatabase();

// --- User Management Functions ---

export async function getUserByKey(accessKey: string) {
    return db.get('SELECT * FROM users WHERE accessKey = ?', accessKey);
}

export async function getUserByOperatorId(operatorId: string) {
    return db.get('SELECT * FROM users WHERE operatorId = ?', operatorId);
}

export async function createUser(userData: { operatorId: string; accessKey: string; securityLevel: string; }) {
    const { operatorId, accessKey, securityLevel } = userData;
    return db.run(
        'INSERT INTO users (operatorId, accessKey, securityLevel) VALUES (?, ?, ?)',
        operatorId,
        accessKey,
        securityLevel
    );
}

export async function updateUserToken(operatorId: string, token: string, tokenExpires: string) {
    return db.run(
        'UPDATE users SET token = ?, tokenExpires = ? WHERE operatorId = ?',
        token,
        tokenExpires,
        operatorId
    );
}


// --- System State Functions ---

export async function getSystemState(key: string): Promise<string | null> {
    const row = await db.get('SELECT value FROM system_state WHERE key = ?', key);
    return row?.value ?? null;
}

export async function setSystemState(key: string, value: string) {
    return db.run(
        'INSERT OR REPLACE INTO system_state (key, value) VALUES (?, ?)',
        key,
        value
    );
}

// --- Audit Log Functions ---
export async function logAuditEvent(eventType: string, operatorId: string | null, details: string) {
  const timestamp = new Date().toISOString();
  // In a real implementation, the signature would be a cryptographic signature of the log entry.
  const signature = crypto.createHash('sha256').update(JSON.stringify({ timestamp, eventType, operatorId, details })).digest('hex');
  
  return db.run(
    'INSERT INTO audit_log (timestamp, eventType, operatorId, details, signature) VALUES (?, ?, ?, ?, ?)',
    timestamp,
    eventType,
    operatorId,
    details,
    signature
  );
}


export { db };