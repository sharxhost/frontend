// https://github.com/Ibaslogic/localstorage-react-hook-project/blob/main/src/useLocalStorage.js

import { useState, useEffect, SetStateAction, Dispatch } from "react";

function getStorageValue<T>(key: string, defaultValue: T) {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : defaultValue;
    return initial;
  }
  else {
    return defaultValue;
  }
}

export function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
