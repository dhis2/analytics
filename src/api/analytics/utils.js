// Define our very own special list of characters that we don't want to encode in the URI
const whitelistURI = ',&$=/;:'
const whitelistURICodes = whitelistURI
    .split('')
    .map((c) => encodeURIComponent(c))
const whitelistRegExp = new RegExp(`(?:${whitelistURICodes.join('|')})`, 'g')

export const customEncodeURIComponent = (uri) =>
    encodeURIComponent(uri).replace(whitelistRegExp, decodeURIComponent)

export const formatRequestPath = ({ path, program, trackedEntityType }) =>
    [path, program, trackedEntityType].filter(Boolean).join('/')

export const formatDimension = ({
    outputType,
    programId,
    programStageId,
    dimension,
}) =>
    [
        outputType === 'TRACKED_ENTITY_INSTANCE' ? programId : undefined,
        programStageId,
        dimension,
    ]
        .filter(Boolean)
        .join('.')
