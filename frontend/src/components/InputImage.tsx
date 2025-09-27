interface InputImageProp {
    url: string
}
function InputImage({ url }: InputImageProp) {
    return (
        <div className="max-w-full overflow-auto max-h-[85vh] rounded-md">
            <img className="rounded-sm border-orange-600 object-cover border-4 md:max-h-[550px] max-w-full md:max-w-xl" src={url} alt="image" />
        </div>
    )
}

export default InputImage