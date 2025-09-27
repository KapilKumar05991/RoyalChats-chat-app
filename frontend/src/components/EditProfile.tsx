import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useRef, useState, type ChangeEvent, type FormEvent, } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import useAuthStore from "@/store/auth-store"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import useUserStore from "@/store/user-store"


function EditProfile() {
    const navigate = useNavigate()
    const image = useRef<File | string>('')
    const { user } = useAuthStore(state => state)
    const { updateProfile, loading} = useUserStore(state => state)
    const [inputs, setInputs] = useState({
        name: user.name,
        oldPassword: '',
        newPassword: '',
    })
    const [passVisible, setPassVisible] = useState(false)
    const [pic, setPic] = useState(user.avatar.path)

    function handleImageChange(e: any) {
        const file = e.target.files
        if (file.length > 0) {
            const image_file = file[0]
            if(!image_file.type.startsWith('image/')) {
                toast('Only Image type supported')
                return
            }
            image.current = image_file
            setPic(URL.createObjectURL(image_file))
        }
    }


    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', inputs.name)
        formData.append('oldPassword', inputs.oldPassword)
        formData.append('newPassword', inputs.newPassword)
        if(image.current) {
            formData.append('profilePic', image.current)
        }
        updateProfile(formData)
    }
    return (
        <Dialog defaultOpen onOpenChange={(open) => { !open && navigate('/') }}>
            <DialogTrigger asChild>
                <span></span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re
                        done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2 items-center justify-evenly">
                            <Avatar className="size-40">
                                <AvatarImage src={pic ? pic : '/user.png'} alt="user_avatar" className="rounded-full object-cover" />
                                <AvatarFallback className="hover:underline">pic</AvatarFallback>
                            </Avatar>
                            <Button  type="button">
                                <Label className="cursor-pointer" htmlFor="pic">Choose Avatar</Label>
                            </Button>
                            <input id="pic" className="hidden" onChange={handleImageChange} type="file" name="profilePic" />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input id="full_name" type="text" onChange={handleChange} name="fullName" value={inputs.name} />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="old_password">Old Password</Label>
                            <div className="flex gap-2">
                                <Input id="old_password" onChange={handleChange} placeholder="Required for changing password" type="text" name="oldPassword" value={inputs.oldPassword} />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="new_password">New Password</Label>
                            <div className="flex gap-2">
                                <Input id="new_password" onChange={handleChange} placeholder="********" type={passVisible ? "text" : "password"} name="newPassword" value={inputs.newPassword} />
                                <Button type="button" onClick={() => setPassVisible(!passVisible)}>{passVisible ? <Eye /> : <EyeOff />}</Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <div className="mt-4 flex gap-2">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button disabled={loading} type="submit">{loading ? 'Updating...': 'Save changes'}</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfile