import { LoaderCircle } from "lucide-react";
import { Toaster } from "./ui/sonner";

function Loading() {
    return (
        <div className="min-h-screen bg-black flex p-2 items-center justify-center">
            <div className="bg-[#202526] text-orange-500 text-2xl font-semibold flex items-center justify-center gap-2 rounded-md p-6 w-full max-w-xl">
               <LoaderCircle className="size-7 mt-0.5 animate-spin" /> <span>Loading</span>
            </div>
            <Toaster position="top-center"/>
        </div>
    )
}

export default Loading