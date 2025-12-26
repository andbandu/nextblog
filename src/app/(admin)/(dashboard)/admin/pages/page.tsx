import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getPages } from '@/lib/data';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, StickyNote, ExternalLink } from 'lucide-react';

export default async function AdminPagesPage() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    const pages = await getPages();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pages</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage static pages like Privacy Policy, About, etc.</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    New Page
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                    {pages.map((page) => (
                        <li key={page.slug} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                                        <StickyNote size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {page.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                                /{page.slug}
                                            </span>
                                            <span>•</span>
                                            <time dateTime={page.date}>
                                                Updated {format(new Date(page.date), 'MMM d, yyyy')}
                                            </time>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={`/${page.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        title="View Live"
                                    >
                                        <ExternalLink size={18} />
                                    </a>
                                    <Link
                                        href={`/admin/pages/${page.slug}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                    {pages.length === 0 && (
                        <li className="p-12 text-center text-gray-500 dark:text-gray-400">
                            <div className="mb-4 flex justify-center text-gray-300 dark:text-gray-700">
                                <StickyNote size={48} />
                            </div>
                            <p>No static pages found. Create your first one!</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
