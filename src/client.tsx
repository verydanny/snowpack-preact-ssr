import 'preact/devtools'
import { h, render } from 'preact'

import { App } from './pages/App'

const root = document.getElementById('root')

if (root) {
  render(<App />, root)
}
