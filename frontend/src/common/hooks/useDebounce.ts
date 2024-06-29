import { useEffect, useState } from "react";

const DELAY = 500; // 500 millisecond

export const useDebounce = (value: any, delay = DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
