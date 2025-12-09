import fs from 'fs';
import path from 'path';

export interface Post {
  slug: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
}

const dataDirectory = path.join(process.cwd(), 'data');
const postsFile = path.join(dataDirectory, 'posts.json');

export function getPosts(): Post[] {
  if (!fs.existsSync(postsFile)) {
    return [];
  }
  const fileContents = fs.readFileSync(postsFile, 'utf8');
  const posts = JSON.parse(fileContents);
  return posts.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): Post | undefined {
  const posts = getPosts();
  return posts.find((post) => post.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export function savePost(post: Post): void {
  const posts = getPosts();
  const existingIndex = posts.findIndex((p) => p.slug === post.slug);
  
  if (existingIndex > -1) {
    posts[existingIndex] = post;
  } else {
    posts.push(post);
  }
  
  // Ensure directory exists
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }
  
  fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

export function getAllTags(): string[] {
  const posts = getPosts();
  const tags = new Set<string>();
  posts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}
