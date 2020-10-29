import type { ServerResponse, IncomingMessage } from 'http'

import anser from 'anser'

export function errorMiddleware(
  _req: IncomingMessage,
  res: ServerResponse,
  message: string,
) {
  const body = anser.ansiToHtml(anser.escapeForHtml(message), {
    use_classes: true,
  })

  res.write(`<!DOCTYPE html>
  <html lang="en">
      <head>
          <meta charset="utf-8">
          <title>SnowPack Server Error</title>
          <style>
          body {
              background: #262626;
              color: #e6e6e6;
              line-height: 1.2;
              font-family: Menlo, Consolas, monospace;
              font-size: 13px;
              white-space: pre;
              margin: 10px;
          }
          h3, h4 { margin: 0; }
          h3 { color: #ff5c5c; }
          .ansi-black-fg, .ansi-bright-black-fg { color: #6d7891; }
          .ansi-white-fg, .ansi-bright-white-fg { color: #fff; }
          .ansi-red-fg, .ansi-bright-red-fg { color: #e36049; }
          .ansi-green-fg, .ansi-bright-green-fg { color: #9eb567; }
          .ansi-yellow-fg, .ansi-bright-yellow-fg { color: #ffd080; }
          .ansi-blue-fg, .ansi-bright-blue-fg { color: #7cafc2; }
          .ansi-magenta-fg, .ansi-bright-magenta-fg { color: #d6add5; }
          .ansi-cyan-fg, .ansi-bright-cyan-fg { color: #c3c2ef; }
          [class$="-bg"] { padding: 2px 4px; border-radius: 2px; }
          .ansi-black-bg, .ansi-bright-black-bg { background-color: #6d7891; color: #fff; }
          .ansi-white-bg, .ansi-bright-white-bg { background-color: #fff; color: #464646; }
          .ansi-red-bg, .ansi-bright-red-bg { background-color: #e36049; color: #fff; }
          .ansi-green-bg, .ansi-bright-green-bg { background-color: #9eb567; color: #464646; }
          .ansi-yellow-bg, .ansi-bright-yellow-bg { background-color: #ffd080; }
          .ansi-blue-bg, .ansi-bright-blue-bg { background-color: #7cafc2; color: #fff; }
          .ansi-magenta-bg, .ansi-bright-magenta-bg { background-color: #d6add5; color: #464646; }
          .ansi-cyan-bg, .ansi-bright-cyan-bg { background-color: #c3c2ef; color: #464646; }
          .ansi-reverse { background-color: #fff; color: #464646; }
          .ansi-dim { opacity: 0.7; }
          .ansi-italic { font-style: italic; }
          .ansi-underline { text-decoration: underline; }
          </style>
      </head>
      <h3>Server Compiler Error</h3>
      <h4>Stack:</h4>
      <body>${body}</body>
  </html>`)
  res.end()
}
