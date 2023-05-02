export type IframeCssUpdatedMessage = {
  type: "xlogMonacoIframeCssUpdated";
  css: string;
};

export type IframeLoadedMessage = {
  type: "xlogMonacoIframeLoaded";
};

export type IframeMessage = IframeCssUpdatedMessage | IframeLoadedMessage;

export type ParentThemeChange = {
  type: "xlogThemeChange";
  theme: "light" | "dark";
};

export type ParentCssMessage = {
  type: "xlogCssInit";
  css: string;
};

export type ParentMessage = ParentThemeChange | ParentCssMessage;
