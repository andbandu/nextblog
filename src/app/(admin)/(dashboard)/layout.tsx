import Link from "next/link";
import { LayoutDashboard, FileText, Plus, LogOut, ExternalLink, Tag, StickyNote, Settings } from "lucide-react";
import { getSetting, SiteInfo } from "@/lib/data";

import { logoutAction } from "@/app/actions";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteInfo = await getSetting<SiteInfo>('site_info');
    return {
        title: `${siteInfo?.title || 'My Blog'} | Admin`,
    };
}

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const siteInfo = await getSetting<SiteInfo>('site_info');
    const siteTitle = siteInfo?.title || 'My Blog';

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/admin" className="text-xl font-bold tracking-tight text-black dark:text-white">
                        {siteTitle}
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>

                    <div className="group flex items-center justify-between px-3 py-2 text-sm font-medium text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <Link href="/admin/posts" className="flex items-center gap-3 flex-1">
                            <FileText size={18} />
                            Posts
                        </Link>
                        <Link
                            href="/admin/posts/new"
                            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                            title="New Post"
                        >
                            <Plus size={14} />
                        </Link>
                    </div>                    <Link
                        href="/admin/tags"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Tag size={18} />
                        Tags
                    </Link>

                    <Link
                        href="/admin/pages"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <StickyNote size={18} />
                        Pages
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Settings size={18} />
                        Settings
                    </Link>

                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-black dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <ExternalLink size={18} />
                        View Site
                    </Link>

                </nav>


                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
