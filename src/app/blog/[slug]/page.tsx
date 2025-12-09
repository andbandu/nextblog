import { getPost, getPosts } from "@/lib/data";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

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

    return (
        <article className="prose prose-lg dark:prose-invert max-w-none">
            <header className="mb-8 not-prose">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <time dateTime={post.date}>
                        {format(new Date(post.date), "MMMM d, yyyy")}
                    </time>
                    <span>•</span>
                    <div className="flex gap-1">
                        {post.tags.map((tag) => (
                            <Link
                                key={tag}
                                href={`/tags/${tag}`}
                                className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-gray-900 dark:text-gray-100">
                    {post.title}
                </h1>
            </header>

            <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                {post.content}
            </div>
        </article>
    );
}
