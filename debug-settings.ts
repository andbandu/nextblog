import { pool } from './src/lib/db';
import dotenv from 'dotenv';
dotenv.config();

async function checkSettings() {
    try {
        const { rows } = await pool.query('SELECT * FROM settings');
        console.log('Settings:', rows);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSettings();
