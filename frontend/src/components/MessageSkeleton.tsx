import { Skeleton } from "@/components/ui/skeleton"

function MessageSkeleton() {
    return (
        <div className="flex flex-col gap-2">
            <div className="space-y-2 w-fit">
                <Skeleton className="rounded-md h-10 w-[200px] bg-gray-500/20">
                </Skeleton>
                <Skeleton className="rounded-md h-10 w-[180px] bg-gray-500/20">
                </Skeleton>
            </div>
            <div className="space-y-2 w-fit flex flex-col self-end">
                <Skeleton className="self-end rounded-md h-10 w-[250px] bg-gray-500/20">
                </Skeleton>
                <Skeleton className="self-end rounded-md h-10 w-[200px] bg-gray-500/20">
                </Skeleton>
            </div>
            <div className="space-y-2 w-fit">
                <Skeleton className="rounded-md self-end h-10 w-[150px] bg-gray-500/20">
                </Skeleton>
                <Skeleton className="rounded-md h-10 w-[250px] bg-gray-500/20">
                </Skeleton>
            </div>
            <div className="space-y-2 w-fit flex flex-col self-end">
                <Skeleton className="self-end rounded-md h-10 w-[250px] bg-gray-500/20">
                </Skeleton>
                <Skeleton className="self-end rounded-md h-10 w-[200px] bg-gray-500/20">
                </Skeleton>
            </div>
            <div className="space-y-2 w-fit">
                <Skeleton className="rounded-md h-10 w-[200px] bg-gray-500/20">
                </Skeleton>
                <Skeleton className="rounded-md h-10 w-[250px] bg-gray-500/20">
                </Skeleton>
            </div>
            <div className="space-y-2 w-fit flex flex-col self-end">
                <Skeleton className="self-end rounded-md h-10 w-[250px] bg-gray-500/20">
                </Skeleton>
                <Skeleton className="self-end rounded-md h-10 w-[200px] bg-gray-500/20">
                </Skeleton>
            </div>
        </div>
    )
}

export default MessageSkeleton