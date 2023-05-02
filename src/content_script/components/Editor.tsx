import React, { useCallback, useEffect, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { useDebounceFn } from "ahooks";
import { editor } from "monaco-editor";
import "../../styles/tailwind.css";
import { updateCss } from "../utils";

export const Editor = () => {
  const [css, setCss] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isCopied, setCopied] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const isValid = useRef(true);

  // useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     // Extract the hostname from the active tab's URL
  //     const url = new URL(tabs[0].url || "");
  //     const hostname = url.hostname;
  //     const key = `${hostname}-css`;
  //     chrome.storage.local.get(key, (result) => {
  //       setCss(result[key]);
  //       setLoading(false);
  //     });
  //   });
  // }, []);

  const onMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const { run: onChange } = useDebounceFn(
    (data: string) => {
      updateCss(data);
    },
    {
      wait: 1000,
    }
  );

  const onValidate = useCallback((errors: any[]) => {
    isValid.current = errors.length === 0;
  }, []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editorRef.current?.getValue() || "");
      setCopied(true);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to set clipboard:", err);
    }
  }, []);

  return (
    <div className="relative overflow-hidden h-[600px] w-[500px] pt-2">
      <MonacoEditor
        defaultLanguage="css"
        options={{
          fontSize: 14,
          minimap: {
            enabled: false,
          },
        }}
        defaultValue={css}
        onMount={onMount}
        onChange={onChange}
        onValidate={onValidate}
      />
      <button
        onClick={onCopy}
        className="absolute w-20 h-10 rounded-sm bottom-5 right-5 bg-teal-600 text-white text-large font-semibold"
      >
        {isCopied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};
