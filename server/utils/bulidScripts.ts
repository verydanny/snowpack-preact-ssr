import fs from 'fs'

interface Output {
  preloadTags: string | undefined
  scriptTags: string | undefined
}

const DEV = process.env.NODE_ENV === 'development'

export function buildScriptHtml(): Output {
  const reduceScripts = (scripts: string[]) => {
    return scripts
      .filter((script) => script.endsWith('.js'))
      .map((script) => {
        return {
          scriptTags: `<script type="module" src="${script}"></script>`,
          preloadTags: `<script type="modulepreload" src="${script}"></script>`,
        }
      })
      .reduce((acc, curr) => ({
        ...acc,
        scriptTags: acc.scriptTags + curr.scriptTags,
        preloadTags: acc.preloadTags + curr.preloadTags,
      }))
  }

  if (DEV) {
    return {
      preloadTags: undefined,
      scriptTags: undefined,
    }
  }

  const assetManifest = JSON.parse(
    fs.readFileSync(`${process.cwd()}/build/asset-manifest.json`, {
      encoding: 'utf-8',
    }),
  )

  return reduceScripts(Object.values(assetManifest))
}
