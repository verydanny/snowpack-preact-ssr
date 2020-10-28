import './extensionShim'
import path from 'path'
import http from 'http'

import fg from 'fast-glob'
import chokidar from 'chokidar'
import WebSocket from 'ws'

import { SERVER_PORT, DEV_SERVER_PORT } from '../src/const'

import { clearSingle, clear, clearAllButExternals } from './utils/clearModule'

const DEV = process.env.NODE_ENV === 'development'

function startServer() {
  const server = http.createServer(async (req, res) =>
    import('./middleware/render')
      .then(({ renderMiddleware }) => renderMiddleware(req, res))
      .catch((err) => {
        console.log(err)
        res.write('Error happened, check logs')
        res.end()
      }),
  )

  server.on('error', (err) => console.error(err))

  server.listen(SERVER_PORT, () => {
    console.log('http server started on port', SERVER_PORT)
  })
}

startServer()

if (DEV) {
  let timeoutId: NodeJS.Timeout

  const connectToHMR = async (poll = 100, timeout = 10000) => {
    const url = `ws://localhost:${DEV_SERVER_PORT}`

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    return new Promise<WebSocket>((resolve, reject) => {
      const ws = new WebSocket(url, 'esm-hmr')

      ws.on('error', (err: NodeJS.ErrnoException) => {
        if (timeout <= 0) {
          return reject(Error('Timeout ran out'))
        }

        if (err.code === 'ECONNREFUSED' && err.syscall === 'connect') {
          timeoutId = setTimeout(
            () => resolve(connectToHMR(poll, timeout - poll)),
            100,
          )
        }
      })
      ws.on('open', () => resolve(ws))
    })
  }

  connectToHMR(100, 10000)
    .then((ws) => {
      console.log('Connected to [esm-hmr]')
      const reloadExtensions = ['.ts', '.tsx', '.css', '.sass', '.scss']
      const srcDir = path.resolve(process.cwd(), 'src')
      const serverDir = path.resolve(process.cwd(), 'server/middleware')
      const watcher = chokidar.watch([
        `${path.resolve(process.cwd(), 'server/middleware')}/**/*`,
      ])
      watcher.on('change', (path) => {
        clearSingle(path)
      })
      ws.on('error', (error) => console.log(error))
      ws.on('message', (data: string) => {
        const parsed = JSON.parse(data)
        if (parsed.type === 'reload') {
          fg.sync(`${serverDir}/**/*`).forEach((file) => clear(file))
        }
        if (parsed.type === 'update') {
          const split = parsed.url.split('/_dist_/').join('')
          const { name, dir } = path.parse(path.resolve(srcDir, split))
          reloadExtensions.forEach((ext) => {
            const match = path.resolve(dir, name + ext)
            clearAllButExternals(match)
          })
        }
      })
    })
    .catch((err) => {
      throw err
    })
}
