import { ArrowDownCircle } from "lucide-react"
import { Button } from "./ui/button"
import ImageDialog from "./ImageDialog"

const cloud_name = import.meta.env.VITE_CLOUD_NAME

interface MessageImageProp {
    url: string
    public_id: string
}
function MessageImage({ url, public_id }: MessageImageProp) {
    const downloadUrl = `https://res.cloudinary.com/${cloud_name}/image/upload/fl_attachment:${Date.now()}/${public_id}.jpg`;
    return (
        <div className="relative cursor-pointer">
            <a download className="absolute bottom-2 right-2" href={downloadUrl}>
                <Button variant={"outline"}>
                    <ArrowDownCircle className="size-6 text-gray-300" />
                </Button>
            </a>
            <ImageDialog url={url} />
            <img className="size-40 md:size-80 rounded-md object-cover" src={url} alt="image" />
        </div>
    )
}
export default MessageImage