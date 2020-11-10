import { h } from 'preact'

interface Props {
  name?: string
}

export function Hello(props: Props) {
  const { name } = props || null
  return <h1>Hello, {name}, let's go deeper</h1>
}

export function Goodbye(props: Props) {
  const { name } = props || null
  return <h1>Hello, {name}, let's go deeper</h1>
}

export function Boop(props: Props) {
  const { name } = props || null
  return <h1>Hello, {name}, let's go deeper</h1>
}

export function ReallyLongFuckingNameOfSomeFunction(props: Props) {
  const { name } = props || null
  return <h1>Hello, {name}, let's go deeper</h1>
}

export default Hello
