import Skeleton from "./_components/Skeleton";

export default function BlogRootLoading() {
    return (
        <div className="space-y-12">
            <section className="space-y-4">
                {/* Hero skeleton */}
                <Skeleton className="h-12 w-3/4 lg:h-14" />
                <Skeleton className="h-6 w-1/2" />
            </section>

            <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        {/* Aspect video feature image skeleton */}
                        <Skeleton className="aspect-video w-full rounded-xl" />

                        {/* Meta info skeleton */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-20" />
                            <span className="text-gray-300">•</span>
                            <Skeleton className="h-4 w-16" />
                        </div>

                        {/* Title skeleton */}
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-2/3" />

                        {/* Excerpt skeleton */}
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
