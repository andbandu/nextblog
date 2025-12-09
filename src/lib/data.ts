import { pool } from './db';

export interface Post {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
}

export async function getPosts(): Promise<Post[]> {
  try {
    const { rows } = await pool.query('SELECT * FROM posts ORDER BY date DESC');
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | undefined> {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE slug = $1', [slug]);
    return rows[0];
  } catch (error) {
    console.error('Database Error:', error);
    return undefined;
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE $1 = ANY(tags) ORDER BY date DESC', [tag]);
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function savePost(post: Post): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO posts (slug, title, content, tags, date)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE 
       SET title = $2, content = $3, tags = $4, date = $5`,
      [post.slug, post.title, post.content, post.tags, post.date]
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save post');
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    const { rows } = await pool.query('SELECT DISTINCT unnest(tags) as tag FROM posts');
    return rows.map(row => row.tag).sort();
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}
