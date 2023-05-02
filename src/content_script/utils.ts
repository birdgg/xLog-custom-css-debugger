export const insertDebuggerNode = () => {
  const debuggerNode = document.createElement("div");
  debuggerNode.setAttribute("id", "xlog-css-debugger");
  document.body.appendChild(debuggerNode);
  return debuggerNode;
};

export const removeDebuggerNode = () => {
  const debuggerNode = document.querySelector(
    "#xlog-css-debugger"
  ) as HTMLElement;
  debuggerNode.remove();
};

export const getIframe = () => {
  return document.querySelector(
    "#xlog-css-debugger iframe"
  ) as HTMLIFrameElement;
};

export const getCss = () => {
  const stylesheet = document
    .querySelector('.xlog-user link[rel="stylesheet"]')
    ?.getAttribute("href");
  if (stylesheet) {
    const regex = /data:text\/css;base64,(.*)/;
    const base64String = stylesheet.match(regex)?.[1] || "";
    return atob(base64String);
  } else {
    return "";
  }
};

export const updateCss = (css: string) => {
  const xlogUserNode = document.querySelector(".xlog-user") as HTMLElement;
  const stylesheet = document.querySelector(
    '.xlog-user link[rel="stylesheet"]'
  );
  const base64CssString = `data:text/css;base64,${btoa(css)}`;
  if (stylesheet) {
    stylesheet?.setAttribute("href", base64CssString);
  } else {
    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", base64CssString);
    xlogUserNode.appendChild(link);
  }
};
