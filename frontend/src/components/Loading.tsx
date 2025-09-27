import { LoaderPinwheelIcon } from "lucide-react";
import { Toaster } from "./ui/sonner";

function Loading() {
    return (
        <div className="min-h-screen bg-black flex p-2 items-center justify-center">
            <div className="bg-[#202526] rounded-md space-y-6 p-6 w-full max-w-xl">
                <h1 className="text-center font-semibold text-orange-500 text-2xl"><LoaderPinwheelIcon size={20} className="inline animate-spin" /> Loading</h1>
            </div>
            <Toaster position="top-center"/>
        </div>
    )
}

export default Loading