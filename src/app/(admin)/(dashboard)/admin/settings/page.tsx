import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSetting, NavLink, SiteInfo } from '@/lib/data';
import NavigationManager from '@/components/NavigationManager';
import BrandingManager from '@/components/BrandingManager';
import SiteInfoManager from '@/components/SiteInfoManager';

export default async function AdminSettingsPage() {
    const isLoggedIn = await isAuthenticated();

    if (!isLoggedIn) {
        redirect('/login');
    }

    const primaryLinks = await getSetting<NavLink[]>('primary_navigation') || [];
    const secondaryLinks = await getSetting<NavLink[]>('secondary_navigation') || [];
    const siteDesign = await getSetting<{ logo_url: string; accent_color: string }>('site_design') || { logo_url: '', accent_color: '#3b82f6' };
    const siteInfo = await getSetting<SiteInfo>('site_info') || { title: 'My Blog', description: 'A blog about everything.' };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Configure your site's identity, navigation, and global branding.</p>
            </div>

            <div className="space-y-8 pb-12">
                <SiteInfoManager initialInfo={siteInfo} />

                <BrandingManager initialDesign={siteDesign} />

                <NavigationManager
                    title="Primary Navigation (Header)"
                    settingKey="primary_navigation"
                    initialLinks={primaryLinks}
                />

                <NavigationManager
                    title="Secondary Navigation (Footer)"
                    settingKey="secondary_navigation"
                    initialLinks={secondaryLinks}
                />
            </div>
        </div>
    );
}
