import Skeleton from "../../_components/Skeleton";

export default function PostLoading() {
    return (
        <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="mb-8">
                {/* Meta info skeleton (Date • Tags) */}
                <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-4 w-24" />
                    <span className="text-gray-300">•</span>
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                </div>

                {/* Title skeleton */}
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-12 w-1/2 mb-6" />

                {/* Excerpt skeleton */}
                <div className="space-y-2 mb-8">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Feature image skeleton */}
                <Skeleton className="aspect-video w-full rounded-xl mb-8" />
            </header>

            {/* Content skeleton blocks */}
            <div className="space-y-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="pt-4 space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="pt-4 space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </article>
    );
}
