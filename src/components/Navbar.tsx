import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { getSetting, NavLink, SiteInfo } from '@/lib/data';


export default async function Navbar() {
    const isLoggedIn = await isAuthenticated();
    const navLinks = await getSetting<NavLink[]>('primary_navigation') || [];
    const design = await getSetting<{ logo_url: string; accent_color: string }>('site_design');
    const siteInfo = await getSetting<SiteInfo>('site_info');
    const siteTitle = siteInfo?.title || 'My Blog';

    return (
        <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    {design?.logo_url ? (
                        <img src={design.logo_url} alt={siteTitle} className="h-8 w-auto object-contain" />
                    ) : (
                        <span className="text-xl font-bold tracking-tight transition-colors">
                            {siteTitle}
                        </span>
                    )}

                </Link>



                <div className="flex items-center gap-6">
                    {navLinks.length > 0 ? (
                        navLinks.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className="text-sm font-medium hover:text-blue-600 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))
                    ) : (
                        <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
                            Home
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

