import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import { getCss, getIframe, removeDebuggerNode, updateCss } from "../utils";
import { ParentCssMessage, ParentThemeChange } from "../../types/iframeMessage";
import type { IframeMessage } from "../../types/iframeMessage";
import { useTheme } from "../../hooks/useTheme";

export function CssEdtior() {
  const theme = useTheme();
  const [isCopied, setCopied] = useState(false);
  const [monacoLoaded, setMonacoLoaded] = useState(false);
  const editorValue = useRef("");
  const { height } = useWindowSize();
  const src = useMemo(
    () => chrome.runtime.getURL("monaco-editor/iframe/index.html"),
    []
  );

  const messageHandler = useCallback(({ data }: { data: IframeMessage }) => {
    switch (data.type) {
      case "xlogMonacoIframeLoaded":
        setMonacoLoaded(true);
        break;
      case "xlogMonacoIframeCssUpdated":
        updateCss(data.css);
        editorValue.current = data.css;
        break;
      default:
      // console.log("message not have a handler", data);
    }
  }, []);

  const postMessageToIframe = useCallback((message: object) => {
    getIframe().contentWindow?.postMessage(message, chrome.runtime.getURL("*"));
  }, []);

  const onCloseClick = useCallback(() => {
    removeDebuggerNode();
  }, []);

  useEffect(() => {
    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, []);

  useEffect(() => {
    if (!monacoLoaded) return;
    const initialCss = getCss();
    if (initialCss) {
      const message: ParentCssMessage = {
        type: "xlogCssInit",
        css: initialCss,
      };
      postMessageToIframe(message);
    }
  }, [monacoLoaded]);

  useEffect(() => {
    if (!monacoLoaded) return;
    const message: ParentThemeChange = {
      type: "xlogThemeChange",
      theme,
    };
    postMessageToIframe(message);
  }, [theme, monacoLoaded]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editorValue.current);
      setCopied(true);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to set clipboard:", err);
    }
  }, []);

  return (
    <div
      className="w-[300px] fixed top-0 right-0 flex flex-col"
      style={{
        height,
        background: "rgba(var(--tw-colors-i-white),var(--tw-bg-opacity))",
        zIndex: 100,
      }}
    >
      <div className="flex justify-between px-2 py-1">
        <h2>xLog custom css debugger</h2>
        <button onClick={onCloseClick}>
          <svg
            className="h-4 w-4 text-black"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </button>
      </div>
      <iframe src={src} className="flex-1" />
      <div className="flex justify-end h-[50px] p-2">
        <button
          onClick={onCopy}
          className="font-bold rounded w-[100px] h-[40px]"
          style={{
            color: "rgba(var(--tw-colors-i-zinc-900),var(--tw-text-opacity))",
            background: "rgb(--tw-colors-i-teal-600)",
          }}
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
