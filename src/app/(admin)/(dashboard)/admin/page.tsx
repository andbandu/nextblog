import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getPosts } from '@/lib/data';

export default async function AdminDashboard() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    const posts = await getPosts();

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">Total Posts</h2>
                    <p className="text-4xl font-bold">{posts.length}</p>
                </div>
                {/* Add more stats here later */}
            </div>
        </div>
    );
}
