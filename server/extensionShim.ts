/* eslint-disable node/no-deprecated-api */

// Create a noop for css, less, sass, etc. Just don't import
// them. This unfortunately means no css modules SSR, but one
// may probably enable it with babel.
require.extensions['.css'] = () => {}
