import { pool } from './db';

export interface Post {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
  feature_image?: string;
  excerpt?: string;
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

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const { rows } = await pool.query('SELECT * FROM posts WHERE slug = $1', [slug]);
    return rows[0] || null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
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
      `INSERT INTO posts (slug, title, content, tags, date, feature_image, excerpt)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (slug) DO UPDATE 
       SET title = $2, content = $3, tags = $4, date = $5, feature_image = $6, excerpt = $7`,
      [post.slug, post.title, post.content, post.tags, post.date, post.feature_image, post.excerpt]
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save post');
  }
}

export async function getTags(): Promise<string[]> {
  const posts = await getPosts();
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags);
}

export async function deletePost(slug: string): Promise<void> {
  try {
    await pool.query('DELETE FROM posts WHERE slug = $1', [slug]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete post');
  }
}
