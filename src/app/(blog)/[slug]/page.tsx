import { getPage } from "@/lib/data";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function StaticPage({ params }: PageProps) {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
        notFound();
    }

    return (
        <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                    {page.title}
                </h1>

                {page.feature_image && (
                    <div className="relative aspect-video w-full mb-8 overflow-hidden rounded-2xl shadow-lg">
                        <img
                            src={page.feature_image}
                            alt={page.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <time dateTime={page.date}>
                        Last updated {format(new Date(page.date), 'MMMM d, yyyy')}
                    </time>
                </div>
            </header>

            <div
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </article>
    );
}
