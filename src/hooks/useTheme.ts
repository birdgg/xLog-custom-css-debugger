import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const observer = useRef<MutationObserver | null>(null);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(document.documentElement.className as Theme);
  }, []);

  useEffect(() => {
    observer.current = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          // @ts-ignore
          setTheme(mutation.target.className);
        }
      });
    });

    observer.current.observe(document.documentElement, { attributes: true });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return theme;
}
