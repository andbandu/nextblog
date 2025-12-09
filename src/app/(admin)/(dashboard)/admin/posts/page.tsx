import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getPosts } from '@/lib/data';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

export default async function AdminPostsPage() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    const posts = await getPosts();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Posts</h1>
                <Link
                    href="/admin/posts/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    New Post
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {posts.map((post) => (
                        <li key={post.slug} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        <span className={post.slug ? "text-green-600" : "text-yellow-600"}>
                                            Published
                                        </span>
                                        <span>•</span>
                                        <time dateTime={post.date}>
                                            {format(new Date(post.date), 'MMM d, yyyy')}
                                        </time>
                                    </div>
                                </div>
                                <Link
                                    href={`/admin/posts/${post.slug}`}
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Edit
                                </Link>
                            </div>
                        </li>
                    ))}
                    {posts.length === 0 && (
                        <li className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No posts found. Create your first one!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
