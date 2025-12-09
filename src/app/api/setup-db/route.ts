import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT[] NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
    return NextResponse.json({ message: 'Database setup successfully' });
  } catch (error) {
    console.error('Setup Error:', error);
    return NextResponse.json({ error: 'Failed to setup database' }, { status: 500 });
  }
}
