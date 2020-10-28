import { h } from 'preact'

interface Props {
  name?: string
}

function Testing(props: Props) {
  return <div>Proper hot reloading</div>
}

export default Testing
