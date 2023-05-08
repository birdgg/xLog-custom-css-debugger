import { decode, encode } from 'js-base64'

export function removeDebuggerNode() {
  const debuggerNode = document.querySelector(
    '#xlog-custom-css-debugger',
  ) as HTMLElement
  debuggerNode.remove()
}

export function getCss() {
  const stylesheet = document
    .querySelector('.xlog-user link[rel="stylesheet"]')
    ?.getAttribute('href')
  if (stylesheet) {
    const regex = /data:text\/css;base64,(.*)/
    const base64String = stylesheet.match(regex)?.[1] || ''
    const cssString = decode(base64String)

    return cssString
  }
  else {
    return ''
  }
}

export function updateCss(css: string) {
  const xlogUserNode = document.querySelector('.xlog-user') as HTMLElement
  const stylesheet = document.querySelector(
    '.xlog-user link[rel="stylesheet"]',
  )
  const base64CssString = `data:text/css;base64,${encode(css)}`
  if (stylesheet) {
    stylesheet?.setAttribute('href', base64CssString)
  }
  else {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', base64CssString)
    xlogUserNode.appendChild(link)
  }
}
