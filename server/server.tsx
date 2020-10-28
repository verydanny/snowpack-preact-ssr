import './extensionShim'
import path from 'path'
import http from 'http'

import fg from 'fast-glob'
import chokidar from 'chokidar'
import clearModule from 'clear-module'
import WebSocket from 'ws'

import { SERVER_PORT, DEV_SERVER_PORT } from '../src/const'

const DEV = process.env.NODE_ENV === 'development'

function startServer() {
  const server = http.createServer(async (req, res) =>
    import('./middleware/render').then(({ renderMiddleware }) =>
      renderMiddleware(req, res),
    ),
  )

  server.on('error', (err) => console.error(err))

  server.listen(SERVER_PORT, () => {
    console.log('http server started on port', SERVER_PORT)
  })
}

startServer()

if (DEV) {
  const reloadExtensions = ['.ts', '.css', '.sass', '.tsx']
  const srcDir = path.resolve(process.cwd(), 'src')
  const serverDir = path.resolve(process.cwd(), 'server/middleware')
  const watcher = chokidar.watch([
    `${path.resolve(process.cwd(), 'server/middleware')}/**/*`,
  ])
  const url = `ws://localhost:${DEV_SERVER_PORT}`
  const ws = new WebSocket(url, 'esm-hmr')

  watcher.on('change', (path) => {
    clearModule.single(path)
  })

  ws.on('error', (error) => console.log(error))

  ws.on('message', (data: string) => {
    const parsed = JSON.parse(data)

    if (parsed.type === 'reload') {
      fg.sync(`${serverDir}/**/*`).forEach((file) => clearModule(file))
    }

    if (parsed.type === 'update') {
      const split = parsed.url.split('/_dist_/').join('')
      const { name, dir } = path.parse(path.resolve(srcDir, split))

      reloadExtensions.forEach((ext) => {
        const match = path.resolve(dir, name + ext)
        if (require.cache[match]) {
          clearModule.single(match)
        }
      })

      fg.sync(`${serverDir}/**/*`).forEach((file) => clearModule.single(file))
    }
  })
}
