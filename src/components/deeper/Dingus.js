import { h } from 'preact'

function Hello(props) {
  const { name } = props || null
  return <h1>Hello, {name}, let's go deeper</h1>
}

export default Hello
