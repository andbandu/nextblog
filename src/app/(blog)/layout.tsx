import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import { getSetting, SiteInfo } from "@/lib/data";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const siteInfo = await getSetting<SiteInfo>('site_info');
    return {
        title: siteInfo?.title || 'My Blog',
        description: siteInfo?.description || 'A blog about everything.',
    };
}


export default async function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const design = await getSetting<{ logo_url: string; accent_color: string }>('site_design');
    const accentColor = design?.accent_color || '#3b82f6';

    return (
        <div className="flex flex-col min-h-screen">
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --accent-primary: ${accentColor};
                }
            `}} />
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
}





