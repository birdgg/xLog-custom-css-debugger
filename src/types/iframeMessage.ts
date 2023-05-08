export interface IframeCssUpdatedMessage {
  type: 'xlogMonacoIframeCssUpdated'
  css: string
}

export interface IframeLoadedMessage {
  type: 'xlogMonacoIframeLoaded'
}

export type IframeMessage = IframeCssUpdatedMessage | IframeLoadedMessage

export interface ParentThemeChange {
  type: 'xlogThemeChange'
  theme: 'light' | 'dark'
}

export interface ParentCssMessage {
  type: 'xlogCssInit'
  css: string
}

export type ParentMessage = ParentThemeChange | ParentCssMessage
