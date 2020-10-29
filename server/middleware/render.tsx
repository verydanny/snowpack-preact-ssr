import type { ServerResponse, IncomingMessage } from 'http'

import render from 'preact-render-to-string'
import { h } from 'preact'

import staticServer from '../staticServer'
import { App } from '../../src/pages/App'
import { SNOWPACK_HMR_SCRIPT, SNOWPACK_DEV_SCRIPT } from '../../src/const'
import { buildScriptHtml } from '../utils/bulidScripts'

const DEV = process.env.NODE_ENV === 'development'
const { preloadTags, scriptTags } = buildScriptHtml()

export function renderMiddleware(req: IncomingMessage, res: ServerResponse) {
  if (
    req.url?.endsWith('.js') ||
    req.url?.endsWith('.map') ||
    req.url?.endsWith('.css')
  ) {
    staticServer(req, res)
  } else {
    const app = render(<App />)

    res.write(`
    <!DOCTYPE html>
    <html>
    <head lang="en">
      <meta charset="utf-8">
      <link rel="canonical" url="${req.url}">
      ${DEV ? SNOWPACK_HMR_SCRIPT : preloadTags}
    </head>
    <body>
      <div id="root">${app}</div>
    </body>`)
    res.write(DEV ? `${SNOWPACK_DEV_SCRIPT}</html>` : `${scriptTags}</html>`)
    res.end()
  }
}
