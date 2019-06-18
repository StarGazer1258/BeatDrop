export const makeRenderKey = (tags) => {
  let key = ''
  for(let i = 0; i < tags.length; i++) if(tags[i].boolean) key += tags[i].tag
  return key
}

export const isKey = key => {
  return (/^[a-f0-9]$/).test(key)
}

export const isHash = hash => {
  return (/^[a-f0-9]{32}$/).test(hash)
}