import React from "react";
import { createRoot } from "react-dom/client";
import { CssEdtior } from "./components/CssEditor";
import { insertDebuggerNode } from "./utils";

const mountReactComponent = () => {
  const mountNode = insertDebuggerNode();
  const root = createRoot(mountNode);

  root.render(<CssEdtior />);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleComponent") {
    mountReactComponent();
    sendResponse("mount React component");
  }
});
