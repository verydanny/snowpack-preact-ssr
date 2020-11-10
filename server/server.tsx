import './extensionShim'
import path from 'path'
import http from 'http'

import chokidar from 'chokidar'
import WebSocket from 'ws'

import { SERVER_PORT, DEV_SERVER_PORT } from '../src/const'

import { clearAllButExternals } from './utils/clearModule'

const DEV = process.env.NODE_ENV === 'development'

function startServer() {
  const server = http.createServer(async (req, res) =>
    import('./middleware/render')
      .then(({ renderMiddleware }) => renderMiddleware(req, res))
      .catch(async (err: NodeJS.ErrnoException) =>
        import('./middleware/error').then(({ errorMiddleware }) =>
          errorMiddleware(req, res, err.stack ? err.stack : err.message),
        ),
      ),
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

  const clientHMRQueue = new Set<string>()
  const totalHMRQueue = new Set<string>()

  connectToHMR()
    .then((ws) => {
      const srcDir = path.resolve(process.cwd(), 'src')
      const serverDir = path.resolve(process.cwd(), 'server/middleware')
      const clientWatcher = chokidar.watch(`${srcDir}/**/*`)
      const serverWatcher = chokidar.watch(`${serverDir}/**/*`)

      clientWatcher.on('change', (path) => {
        totalHMRQueue.add(path)
        clientHMRQueue.add(path)
      })
      serverWatcher.on('change', (path) => {
        totalHMRQueue.add(path)
        clearAllButExternals(path)
      })

      ws.on('error', (error) => console.log(error))
      ws.on('message', (data: string) => {
        const parsed = JSON.parse(data)
        if (parsed.type === 'reload') {
          totalHMRQueue.forEach((item) => clearAllButExternals(item))
          totalHMRQueue.clear()
        }
        if (parsed.type === 'update') {
          console.log(`Queue`, clientHMRQueue)
          clientHMRQueue.forEach((item) => clearAllButExternals(item))
          clientHMRQueue.clear()
        }
      })
    })
    .catch((err) => {
      throw err
    })
}
