import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";

interface ImageDialogProp {
    url: string
}
function ImageDialog({ url }: ImageDialogProp) {
    return (
        <Dialog>
            <DialogTrigger className="absolute w-4/5 h-4/5" asChild>
                <span className="text-gray-400"></span>
            </DialogTrigger>
            <DialogContent className="overflow-auto">
                <DialogTitle className="text-center"></DialogTitle>
                <DialogDescription>
                </DialogDescription>
                <img className="h-[500px] md:h-[600px] mx-auto object-contain" src={url} />
            </DialogContent>
        </Dialog>
    )
}

export default ImageDialog