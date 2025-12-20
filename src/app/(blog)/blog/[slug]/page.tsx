import { getPost, getPosts } from "@/lib/data";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Image from "next/image";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

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
