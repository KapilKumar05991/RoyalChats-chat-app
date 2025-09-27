import { useEffect, useState } from "react"

function useDebounce(value: any, delay: number) {
    const [Value, setValue] = useState(value)
    let clock: any;
    useEffect(() => {
        clock = setTimeout(() => {
            setValue(value)
        }, delay)

        return () => {
            clearTimeout(clock)
        }
    }, [value, delay])

    return Value
}

export default useDebounce