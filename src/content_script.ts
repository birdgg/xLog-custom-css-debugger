import { event_original_css, event_update_css } from "./events";

const stylesheet = document
  .querySelector('.xlog-user link[rel="stylesheet"]')
  ?.getAttribute("href");
if (stylesheet) {
  const regex = /data:text\/css;base64,(.*)/;
  const base64String = stylesheet.match(regex)?.[1];
  if (base64String) {
    chrome.runtime.sendMessage({
      type: event_original_css,
      data: atob(base64String),
      domain: window.location.hostname,
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === event_update_css) {
    const css = message.data;
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
    sendResponse("received");
  }
});
