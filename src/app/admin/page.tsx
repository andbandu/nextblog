import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { createPostAction, logoutAction } from '@/app/actions';

export default async function AdminPage() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Create New Post</h1>
                <form action={logoutAction}>
                    <button type="submit" className="text-sm text-red-600 hover:text-red-800">
                        Logout
                    </button>
                </form>
            </div>

            <form action={createPostAction} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Slug
                    </label>
                    <input
                        type="text"
                        name="slug"
                        id="slug"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        id="tags"
                        placeholder="nextjs, react, tutorial"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white sm:text-sm p-2 border"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Content
                    </label>
                    <textarea
                        name="content"
                        id="content"
                        rows={10}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white sm:text-sm p-2 border"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Publish Post
                </button>
            </form>
        </div>
    );
}
