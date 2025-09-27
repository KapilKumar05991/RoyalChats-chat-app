import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, UserCircle2 } from "lucide-react"
import useAuthStore from "@/store/auth-store"
import { Link } from "react-router-dom"


export function Menu() {
    const logout = useAuthStore(state => state.logout)
    function handleLogout() {
        logout()
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="py-5"><Settings className="size-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-20" align="start">
                <DropdownMenuLabel className="flex gap-1.5 justify-between items-center">Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <span className="flex w-full items-center justify-between">
                            <Link to={'/edit'}>Edit Profile</Link> <UserCircle2 />
                        </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span onClick={handleLogout} className="flex w-full items-center justify-between">
                            <span>Log out</span> <LogOut />
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
