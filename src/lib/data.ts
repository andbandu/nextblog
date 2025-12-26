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

export interface Page {
  slug: string;
  title: string;
  content: string;
  date: string;
  feature_image?: string;
}

export interface NavLink {
  label: string;
  url: string;
}

export interface SiteInfo {
  title: string;
  description: string;
}

export interface Tag {
  id?: number;
  name: string;
  slug: string;
}

export async function getTags(): Promise<Tag[]> {
  try {
    const { rows } = await pool.query('SELECT * FROM tags ORDER BY name ASC');
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function createTag(name: string): Promise<void> {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  try {
    await pool.query(
      'INSERT INTO tags (name, slug) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
      [name, slug]
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create tag');
  }
}

export async function deleteTag(slug: string): Promise<void> {
  try {
    await pool.query('DELETE FROM tags WHERE slug = $1', [slug]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete tag');
  }
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

export async function deletePost(slug: string): Promise<void> {
  try {
    await pool.query('DELETE FROM posts WHERE slug = $1', [slug]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete post');
  }
}

export async function getPages(): Promise<Page[]> {
  try {
    const { rows } = await pool.query('SELECT * FROM pages ORDER BY date DESC');
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function getPage(slug: string): Promise<Page | null> {
  try {
    const { rows } = await pool.query('SELECT * FROM pages WHERE slug = $1', [slug]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function savePage(page: Page): Promise<void> {
  try {
    const { slug, title, content, date, feature_image } = page;
    await pool.query(
      `INSERT INTO pages (slug, title, content, date, feature_image)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (slug) DO UPDATE
       SET title = EXCLUDED.title,
           content = EXCLUDED.content,
           date = EXCLUDED.date,
           feature_image = EXCLUDED.feature_image`,
      [slug, title, content, date, feature_image]
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save page');
  }
}

export async function deletePage(slug: string): Promise<void> {
  try {
    await pool.query('DELETE FROM pages WHERE slug = $1', [slug]);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete page');
  }
}

export async function getSetting<T>(key: string): Promise<T | null> {
  try {
    const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
    if (rows.length === 0) return null;
    return JSON.parse(rows[0].value) as T;
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}

export async function saveSetting(key: string, value: any): Promise<void> {
  try {
    const stringValue = JSON.stringify(value);
    await pool.query(
      `INSERT INTO settings (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value`,
      [key, stringValue]
    );
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save setting');
  }
}


