import { sendMessage } from 'webext-bridge/background'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {

})

// const previousTabId = 0

browser.contextMenus.create({
  id: 'toggleComponent',
  title: 'Toggle xLog css debugger',
  contexts: ['all'],
})

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'toggleComponent' && tab?.id)
    sendMessage('toggleComponent', {}, `content-script@${tab.id}`)
})
