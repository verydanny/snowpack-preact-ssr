import { h } from 'preact'

import Testing from './Testing'

interface Props {
  name?: string
}

function Hello(props: Props) {
  return (
    <div>
      Testing
      <Testing />
    </div>
  )
}

export default Hello
