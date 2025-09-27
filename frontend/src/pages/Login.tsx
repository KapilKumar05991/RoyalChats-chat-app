import { Link } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/auth-store";

const Login = () => {
    const { login } = useAuthStore(state => state)
    const [loading,setLoading] = useState(false)
    const [inputs,setInputs] = useState({
        email: '',
        password: ''
    })

    async function handleSubmit(e:FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        await login(inputs)
        setLoading(false)
    }
  return (
        <div className="min-h-screen flex p-2 items-center justify-center">
            <div className="bg-[#202526] rounded-md space-y-6 p-6 w-full max-w-xl">
                <h1 className="text-center font-semibold text-orange-500 text-2xl">Login to RoyalChats.com</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 justify-between">
                    
                    <Label htmlFor="email">Email</Label>
                    <Input required id="email" onChange={(e) => {setInputs({...inputs,[e.target.name]: e.target.value})}} value={inputs.email} name="email" placeholder="Enter Email" />

                    <Label htmlFor="password">Password</Label>
                    <Input required id="password" type="password" onChange={(e) => {setInputs({...inputs,[e.target.name]: e.target.value})}} value={inputs.password} name="password" placeholder="Enter Password" />
                    
                    <Button disabled={loading}>Login</Button>

                </form>
                <p className="text-center">Don't Have an account? <Link className="text-orange-500 hover:underline" to={'/register'}>Register</Link></p>
            </div>
        </div>
    )
}

export default Login