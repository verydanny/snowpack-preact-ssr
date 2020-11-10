import { h } from 'preact'

interface Props {
  name?: string
}

function Hello(props: Props) {
  const { name } = props || null
  return <h1>Hello, {name}, let's go deeper</h1>
}

export default Hello
