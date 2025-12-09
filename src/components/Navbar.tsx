import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';

export default async function Navbar() {
    const isLoggedIn = await isAuthenticated();

    return (
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight hover:text-blue-600 transition-colors">
                    My Blog
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Home
                    </Link>
                    {isLoggedIn ? (
                        <Link href="/admin" className="text-sm font-medium hover:text-blue-600 transition-colors">
                            Admin
                        </Link>
                    ) : (
                        <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
