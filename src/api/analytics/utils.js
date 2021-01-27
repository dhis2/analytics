// Define our very own special list of characters that we don't want to encode in the URI
const whitelistURI = ',&$=/;:'
const whitelistURICodes = whitelistURI.split('').map(c => encodeURIComponent(c))
const whitelistRegExp = new RegExp(`(?:${whitelistURICodes.join('|')})`, 'g')

export const customEncodeURIComponent = uri =>
    encodeURIComponent(uri).replace(whitelistRegExp, decodeURIComponent)
