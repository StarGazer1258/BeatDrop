export const makeRenderKey = (tags) => {
  let key = ''
  for(let i = 0; i < tags.length; i++) if(tags[i].boolean) key += tags[i].tag
  return key
}