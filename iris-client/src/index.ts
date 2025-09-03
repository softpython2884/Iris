import axios from 'axios';
import * as readline from 'readline';

const SERVER_URL = 'http://127.0.0.1:9002'; // Assuming local dev server port

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.clear();
  console.log('╭───────────────────────────────────╮');
  console.log('│   IRIS Sub-System Access Terminal   │');
  console.log('╰───────────────────────────────────╯');
  console.log('\nConnecting to master server...');

  try {
    // Simple ping to check if server is up, not a real endpoint yet
    await axios.get(SERVER_URL);
    console.log('Connection established.');
  } catch (error) {
    console.error('Error connecting to master server. Is it running?');
    process.exit(1);
  }
  
  const accessKey = await askQuestion('Enter Access Key: ');
  
  try {
    const response = await axios.post(`${SERVER_URL}/api/auth/login`, { accessKey });
    const { operatorId, securityLevel, token } = response.data;
    
    console.log(`\nWelcome, ${operatorId}.`);
    console.log(`Permission Level: ${securityLevel}`);
    console.log('Authentication successful. Session token acquired.');
    console.log('\nType "help" for a list of commands.');

  } catch (error: any) {
    if (error.response) {
        console.error(`\nAuthentication failed: ${error.response.data.error} (Status: ${error.response.status})`);
    } else {
        console.error('\nAn unexpected error occurred during login.');
    }
  }

  rl.close();
}

main();
