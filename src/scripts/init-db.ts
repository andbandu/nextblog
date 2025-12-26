import { Pool } from '@neondatabase/serverless';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function initDb() {
    console.log('Initializing database tables...');

    try {
        // Create tags table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tags (
                id SERIAL PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                slug TEXT UNIQUE NOT NULL
            )
        `);
        console.log('Tags table ensured.');

        // Populate tags table from existing posts
        const { rows: postRows } = await pool.query('SELECT tags FROM posts');
        const allTags = new Set<string>();
        postRows.forEach(row => {
            if (row.tags) {
                row.tags.forEach((tag: string) => allTags.add(tag));
            }
        });

        for (const tagName of allTags) {
            const slug = tagName.toLowerCase().replace(/\s+/g, '-');
            await pool.query(`
                INSERT INTO tags (name, slug)
                VALUES ($1, $2)
                ON CONFLICT (name) DO NOTHING
            `, [tagName, slug]);
        }
        console.log('Tags table populated from existing posts.');

        // Create posts table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS posts (
                slug TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                tags TEXT[],
                date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                feature_image TEXT,
                excerpt TEXT
            )
        `);
        console.log('Posts table ensured.');

        // Create pages table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pages (
                slug TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                feature_image TEXT
            )
        `);
        console.log('Pages table ensured.');

        // Create settings table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        `);
        console.log('Settings table ensured.');

        // Initial seed if empty
        const { rows } = await pool.query('SELECT count(*) FROM posts');
        if (parseInt(rows[0].count) === 0) {
            console.log('Seeding initial post...');
            await pool.query(`
                INSERT INTO posts (slug, title, content, tags, date, excerpt)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                'hello-world',
                'Hello World',
                '# Welcome to my blog\n\nThis is your first post. You can edit or delete it from the admin dashboard.',
                ['general'],
                new Date().toISOString(),
                'Welcome to your new Next.js blog!'
            ]);
            console.log('Initial post seeded.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Database Error:', error);
        process.exit(1);
    }
}

initDb();
