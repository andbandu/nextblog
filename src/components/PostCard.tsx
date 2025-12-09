import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/lib/data';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="group relative flex flex-col space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <time dateTime={post.date}>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
                <span>•</span>
                <div className="flex gap-1">
                    {post.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                </Link>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                {post.content}
            </p>

            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 pt-2">
                Read more →
            </div>
        </article>
    );
}
