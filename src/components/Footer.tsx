import { getSetting, NavLink } from '@/lib/data';
import Link from 'next/link';

export default async function Footer() {
    const navLinks = await getSetting<NavLink[]>('secondary_navigation') || [];

    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
                    {navLinks.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url}
                            className="hover:text-[var(--accent-primary,#3b82f6)] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
            </div>
        </footer>
    );
}

