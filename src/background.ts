import { event_original_css } from "./events";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === event_original_css) {
    chrome.storage.local.set({ [`${request.domain}-css`]: request.data });
  }
});
