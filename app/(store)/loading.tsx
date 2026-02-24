import { Container } from "@/components/ui/Container";

export default function Loading() {
    return (
        <Container className="py-12">
            <div className="w-48 h-10 bg-white/5 rounded-md animate-pulse mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-4">
                        <div className="aspect-[4/5] w-full rounded-2xl bg-white/5 animate-pulse" />
                        <div className="space-y-2">
                            <div className="h-5 bg-white/5 rounded w-3/4 animate-pulse" />
                            <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <div className="h-6 bg-white/5 rounded w-1/4 animate-pulse" />
                            <div className="h-10 w-full max-w-[120px] bg-white/5 rounded-full animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
}
