import { useEffect, useState } from "react";

function useMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)

    function handleChange(e: MediaQueryListEvent) {
        setIsMobile(e.matches)
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1024px)');
        mediaQuery.addEventListener('change', handleChange)
        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])
    
    return isMobile
}

export default useMobile