/**
 * 删除对象中值为空的key
 * @param {*} obj
 * @returns
 */
export const removeEmpty = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
    else if (obj[key] == null || obj[key] === undefined || obj[key] === '') delete obj[key]
  })
  return obj
}
