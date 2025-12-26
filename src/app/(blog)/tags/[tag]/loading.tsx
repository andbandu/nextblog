import Skeleton from "../../_components/Skeleton";

export default function TagLoading() {
    return (
        <div className="space-y-12">
            <header className="space-y-2">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-32" />
            </header>

            <div className="space-y-10">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-4 max-w-2xl">
                        <Skeleton className="aspect-video w-full rounded-xl" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-20" />
                            <span className="text-gray-300">•</span>
                            <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
