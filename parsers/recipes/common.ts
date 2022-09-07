export function capitalizeFirstLetter(str: string) {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function capitalizeFirstLetterEndWithDot(str: string) {
  if (!str) return str

  str = str.charAt(0).toUpperCase() + str.slice(1).trim()
  str = capitalizeFirstLetter(str)

  if (!['.', '?', '!'].some(x => str.endsWith(x))) {
    str += '.'
  }
  return str
}