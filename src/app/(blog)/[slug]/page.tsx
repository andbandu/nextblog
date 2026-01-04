import { getPage, getPages, getPost, getPosts } from "@/lib/data";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = await getPosts();
    const pages = await getPages();

    const postParams = posts.map((post) => ({
        slug: post.slug,
    }));

    const pageParams = pages.map((page) => ({
        slug: page.slug,
    }));

    return [...postParams, ...pageParams];
}

export default async function CombinedPage({ params }: PageProps) {
    const { slug } = await params;

    // Try to find a post first
    const post = await getPost(slug);

    if (post) {
        const { title, feature_image, excerpt, date, tags, content } = post;
        return (
            <article className={`prose prose-lg dark:prose-invert max-w-none ${styles.postArticle}`}>
                <header className={`mb-8 not-prose ${styles.postHeader}`}>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <time dateTime={date}>
                            {format(new Date(date), "MMMM d, yyyy")}
                        </time>
                        <span>•</span>
                        <div className="flex gap-1">
                            {tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/tags/${tag}`}
                                    className={`bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${styles.postTag}`}
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <h1 className={styles.postTitle}>
                        {title}
                    </h1>
                    {excerpt && (
                        <p className={styles.postExcerpt}>
                            {excerpt}
                        </p>
                    )}
                    {feature_image && (
                        <div className={`relative aspect-video w-full overflow-hidden rounded-xl mb-8 shadow-sm ${styles.postFeatureImage}`}>
                            <Image
                                src={feature_image}
                                alt={title}
                                fill
                                priority // High priority because it's above the fold
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 1200px"
                            />
                        </div>
                    )}
                </header>

                <div
                    className={`whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed gh-content ${styles.postContent}`}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </article>
        );
    }

    // If no post found, try to find a page
    const page = await getPage(slug);

    if (page) {
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

    // If neither found, 404
    notFound();
}
