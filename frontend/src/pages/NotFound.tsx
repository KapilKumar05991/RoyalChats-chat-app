import { Link } from "react-router-dom"

const NotFound = () => {

    return (
        <div className="min-h-screen flex p-2 items-center justify-center">
            <div className="bg-[#202526] rounded-md space-y-6 p-6 w-full max-w-xl">
                <h1 className="text-center font-semibold text-orange-500 text-2xl">404: Page Not Found</h1>
                <p className=" text-lg text-center"><Link className="text-orange-400 hover:underline" to={'/'}>Go To Home</Link></p>
            </div>
        </div>
    )

}

export default NotFound