import {  Image, LoaderPinwheel, SendHorizonal, SmilePlus, X } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from "react"
import { Label } from "./ui/label"
import InputImage from "./InputImage";
import { toast } from "sonner";
import useDebounce from "@/hooks/useDebounce";
import useChatStore from "@/store/chat-store";
import useSocketStore from "@/store/socket-store";

function InputMessage() {
    const { conversation, receiver, sendMessage } = useChatStore(state => state)
    const emmitTyping = useSocketStore(state => state.emmitTyping)
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('')
    const [picker, setPicker] = useState(false)
    const [pic, setPic] = useState('')
    const image = useRef<File | string>('')
    const text = input.trim()
    const value = useDebounce(text,100)

    useEffect(() => {
        if(value) {
            emmitTyping()
        }
    },[value])

    async function handleClick() {
        if (!text && !image.current) {
            return
        }
        const formData = new FormData()
        formData.append('text', text)
        formData.append('conversationId', conversation._id)
        formData.append('isGroup',conversation.is_group ?'true':'false')
        formData.append('receiverId', receiver._id)
        if (image.current) {
            formData.append('file', image.current)
        }
        setLoading(true)
        await sendMessage(formData)
        setLoading(false)
        image.current = ''
        setPic('')
        setInput('')
    }

    function onClickEmoji(emojiData: any) {
        setInput((input) => (input + emojiData.emoji))
    }
    function handleImageChange(e: any) {
        const file = e.target.files
        if (file.length > 0) {
            const image_file = file[0]
            const type = image_file.type
            if (!type.startsWith('image/')) {
                toast('Only Image type Supported')
                return
            }
            image.current = image_file
            setPic(URL.createObjectURL(image_file))
        }
    }
    function handleClear() {
        image.current = ''
        setPic('')
    }
    return (
        <div className="backdrop-blur-2xl relative md:rounded-b-md p-2">
            <div className="flex items-center gap-1 md:gap-2">
                <Label className="text-primary" onClick={() => setPicker(!picker)}>
                    <SmilePlus size={25} />
                </Label>
                {picker &&
                    <EmojiPicker autoFocusSearch={false} onEmojiClick={onClickEmoji} open={true} style={{ zIndex: 50,position: 'absolute', bottom: 50, backgroundColor: "#eee" }} height={400} width={300} />
                }
                <Label className="text-primary" htmlFor="file">
                    <Image size={25} />
                </Label>
                <input onChange={handleImageChange} className="hidden" type="file" name="file" id="file" />
                {pic && <div className="absolute z-40 bottom-14 right-0.5 md:left-1"><InputImage url={pic} /><Button onClick={handleClear} variant={"destructive"} className="cursor-pointer absolute top-2 left-2"><X size={20} /></Button></div>}
                <div onClick={() => setPicker(false)} className="flex-1 text-lg flex gap-2">
                    <Input className="py-5" onChange={(e) => setInput(e.target.value)} name="input" value={input} placeholder="Write Message ..." />
                    <Button className="py-5" disabled={loading} onClick={handleClick}>
                        {loading ? <LoaderPinwheel className="animate-spin size-4" /> : <span className="flex justify-center items-center gap-2"><span className="hidden md:inline text-lg">Send</span> <SendHorizonal className="size-5" /></span>}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default InputMessage