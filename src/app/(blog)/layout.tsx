import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                {children}
            </main>
            <Footer />
        </div>
    );
}
