import path from 'path'

import resolveFrom from 'resolve-from'
import parentModule from 'parent-module'

const resolve = (moduleId: string) => {
  try {
    const parent = parentModule(__filename)

    if (parent) {
      return resolveFrom(path.dirname(parent), moduleId)
    }
  } catch (_) {
    // empty catch
  }
}

export const clear = (moduleId: string) => {
  if (typeof moduleId !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof moduleId}\``)
  }

  const filePath = resolve(moduleId)

  if (!filePath) {
    return
  }

  const cachedModule = require.cache[filePath]

  if (cachedModule) {
    const moduleParents = Object.values(require.cache).filter((mod) => {
      if (mod?.children?.includes(cachedModule)) {
        return true
      }

      return false
    })

    console.log('Parents :', moduleParents)
  }

  // Remove all descendants from cache as well
  if (cachedModule) {
    const { children } = cachedModule

    // Delete module from cache
    delete require.cache[filePath]

    for (const { id } of children) {
      clear(id)
    }
  }
}

export const clearAll = () => {
  const parent = parentModule(__filename)

  if (parent) {
    const directory = path.dirname(parent)

    for (const moduleId of Object.keys(require.cache)) {
      delete require.cache[resolveFrom(directory, moduleId)]
    }
  }
}

export const clearOnMatch = (regex: RegExp) => {
  for (const moduleId of Object.keys(require.cache)) {
    if (regex.test(moduleId)) {
      clear(moduleId)
    }
  }
}

export const clearSingle = (moduleId: string) => {
  if (typeof moduleId !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof moduleId}\``)
  }

  const resolved = resolve(moduleId)

  if (resolved) {
    delete require.cache[resolved]
  }
}

const clearParents = (mod: NodeModule, prevNode: string[]): any => {
  for (const key of Object.keys(require.cache)) {
    const modValue = require.cache[key]
    const indexOfChild = modValue?.children?.indexOf(mod)

    if (modValue && indexOfChild && indexOfChild !== -1) {
      if (modValue && modValue.id !== '.') {
        prevNode?.push(modValue?.id)
        modValue?.children?.splice(indexOfChild, 1)

        const mainModIndex = require.main?.children.indexOf(modValue)

        if (mainModIndex && mainModIndex !== -1) {
          require.main?.children.splice(mainModIndex, 1)
        }

        return clearParents(modValue, prevNode)
      }
    }
  }

  return prevNode
}

export const clearAllButExternals = (moduleId: string) => {
  if (typeof moduleId !== 'string') {
    throw new TypeError(`Expected a \`string\`, got \`${typeof moduleId}\``)
  }

  const filePath = resolve(moduleId)

  if (!filePath) {
    return
  }

  const cachedModule = require.cache[filePath]

  if (cachedModule) {
    const toClear = clearParents(cachedModule, [cachedModule.id])

    // Remove all descendants from cache as well
    const { children } = cachedModule

    for (const { id } of children) {
      if (!id.includes('/node_modules/')) {
        clearAllButExternals(id)
      }
    }

    return toClear.forEach((id: string) => {
      console.log(`Hot reloading on Server: ${id}`)

      delete require.cache[id]
    })
  }
}
