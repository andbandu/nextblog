import { Pool } from '@neondatabase/serverless';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function verifyTags() {
    try {
        const { rows } = await pool.query('SELECT * FROM tags');
        console.log('Tags in database:', rows);
        process.exit(0);
    } catch (error) {
        console.error('Verification Error:', error);
        process.exit(1);
    }
}

verifyTags();
