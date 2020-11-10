/* eslint-disable node/no-deprecated-api */

import * as path from 'path'

import moduleAlias from 'module-alias'

const srcDir = path.join(__dirname, '../src')

moduleAlias.addAliases({
  '@components': path.join(srcDir, 'components'),
  components: path.join(srcDir, 'components'),
})

// Create a noop for css, less, sass, etc. Just don't import
// them. This unfortunately means no css modules SSR, but one
// may probably enable it with babel.
require.extensions['.css'] = () => ({})
require.extensions['.scss'] = () => ({})
require.extensions['.sass'] = () => ({})
require.extensions['.svg'] = () => ({})
