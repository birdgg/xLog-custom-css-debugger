chrome.contextMenus.create({
  id: "toggleComponent",
  title: "Toggle xLog css debugger",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toggleComponent" && tab?.id) {
    chrome.tabs.sendMessage(tab.id, { action: "toggleComponent" });
  }
});
