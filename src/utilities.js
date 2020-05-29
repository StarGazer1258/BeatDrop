export const isIndex = index => {
  return (/^[0-9]+$/).test(index)
}

export const isHash = hash => {
  return (/^[a-f0-9]{32}$/).test(hash)
}

export const makeUrl = (candidateBase, path = '') => {
  let url
  const splitBase = candidateBase.match(/^(([a-zA-Z]+:\/\/)?[^/]+\/?)(.*)/)
  const base = splitBase[1]
  const basePath = splitBase[3] || ''
  path = (basePath + '/' + path).replace('//', '/')
  try {
    url = new URL(path, base).toString()
  } catch (e) {
    try {
      url = new URL(`${base}/${path}`.replace(/([^:])(\/\/+)/g, '$1/')).toString()
    } catch (e) {
      url = `${base}/${path}`
    }
  }

  return url
}