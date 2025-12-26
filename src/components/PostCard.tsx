import Link from 'next/link';
import { format } from 'date-fns';
import { Post } from '@/lib/data';

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <article className="group relative flex flex-col space-y-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            {post.feature_image && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-4">
                    <img
                        src={post.feature_image}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <time dateTime={post.date}>
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                </time>
                <span>•</span>
                <div className="flex gap-1">
                    {post.tags.map(tag => (
                        <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag)}`}
                            className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full hover:bg-[var(--accent-primary,#3b82f6)] hover:text-white transition-colors cursor-pointer text-gray-700 dark:text-gray-300 relative z-10"
                        >
                            {tag}
                        </Link>
                    ))}
                </div>

            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 transition-colors">
                <Link className='text-gray-900 dark:text-gray-100' href={`/blog/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                </Link>
            </h2>

            <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').slice(0, 300) + (post.content.length > 300 ? '...' : '')}
            </p>

            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 pt-2">
                Read more →
            </div>

        </article>
    );
}
