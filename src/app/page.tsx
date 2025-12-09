import Image from "next/image";
import { getPosts } from "@/lib/data";
import PostCard from "@/components/PostCard";

export default function Home() {
  const posts = getPosts();

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to My Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          Sharing thoughts on technology, design, and web development.
        </p>
      </section>

      <div className="grid gap-10 sm:grid-cols-1 lg:grid-cols-1">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
