module.exports = (api) => {
  api.cache.forever()

  return {
    presets: [
      [
        '@babel/preset-react',
        {
          pragma: 'h',
          pragmaFrag: 'Fragment',
        },
      ],
      [
        '@babel/preset-typescript',
        {
          onlyRemoveTypeImports: true,
        },
      ],
    ],
  }
}
