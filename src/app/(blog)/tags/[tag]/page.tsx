import { getPostsByTag, getTags } from "@/lib/data";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

interface TagPageProps {
    params: Promise<{
        tag: string;
    }>;
}

export async function generateStaticParams() {
    const tags = await getTags();
    return tags.map((tag) => ({
        tag: tag.name,
    }));
}


export default async function TagPage({ params }: TagPageProps) {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    const posts = await getPostsByTag(decodedTag);

    if (posts.length === 0) {
        notFound();
    }

    return (
        <div className="space-y-12">
            <header>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Posts tagged with <span className="text-[var(--accent-primary,#3b82f6)]">#{decodedTag}</span>
                </h1>

                <p className="text-gray-600 dark:text-gray-400">
                    Found {posts.length} post{posts.length === 1 ? "" : "s"}.
                </p>
            </header>

            <div className="grid gap-10 sm:grid-cols-1 lg:grid-cols-1">
                {posts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                ))}
            </div>
        </div>
    );
}
