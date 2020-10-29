module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-babel',
    '@prefresh/snowpack',
    [
      '@snowpack/plugin-webpack',
      {
        sourceMap: true,
        manifest: true,
      },
    ],
  ],
  install: [],
  installOptions: {
    installTypes: true,
  },
  devOptions: {
    open: 'none',
  },
  buildOptions: {},
  proxy: {},
  alias: {},
}
