import { useEffect, useState } from "react";
//adds delay to search so that results aren't always refreshing by typing
function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay || 500); //get result after default 500 miliseconds

        return () => {
            clearTimeout(timer); //no overflow
        }
    }, [value, delay]);

    return debouncedValue
}

export default useDebounce;