import { h } from 'preact'
import {
  Hello,
  Goodbye,
  Boop,
  ReallyLongFuckingNameOfSomeFunction,
} from '@components/deeper/Deeper'
import DeeperIndex from 'components/deeper'
import someSvg from 'components/deeper/someSvg.svg'

import DeeperJS from '../components/deeper/Dingus.js'

import './App.css'

const Deeper = () => import('components/deeper/Deeper')
const testRequire = () => require('components/deeper/Deeper')

export const App = () => (
  <div>
    <Hello />
    <DeeperIndex name="Deep" />
  </div>
)
