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

        console.log('Connected to the SQLite database.');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                operatorId TEXT PRIMARY KEY,
                accessKey TEXT NOT NULL UNIQUE,
                securityLevel TEXT NOT NULL,
                token TEXT,
                tokenExpires TEXT
            );
        `);
        
        console.log('Users table is ready.');

        // Add a default user if they don't exist
        const defaultUser = await db.get('SELECT * FROM users WHERE operatorId = ?', 'Operator-7');
        if (!defaultUser) {
            await db.run(
                'INSERT INTO users (operatorId, accessKey, securityLevel) VALUES (?, ?, ?)',
                'Operator-7',
                'IRIS-Ut9OWLLQWhB#FEc6awCLdLlZrSUh$WGzLHpvvCbY', // Pre-defined key from user
                '7'
            );
            console.log('Default user "Operator-7" created.');
        }

    } catch (error) {
        console.error('Error initializing database', error);
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

export { db };
