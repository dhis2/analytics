const headerStacksAreEqual = (a, b, limit) => {
    for (let i = 0; i <= limit; ++i) {
        if (a[i] !== b[i]) {
            return false
        }
    }
    return true
}

export const getHeaderForDisplay = ({
    start,
    count,
    index,
    dimensionLevel,
    getHeader,
    showHierarchy,
}) => {
    const header = getHeader(index)
    const showHeader =
        index === start ||
        !headerStacksAreEqual(header, getHeader(index - 1), dimensionLevel)
    if (!showHeader) {
        return null
    }

    let span = 1
    for (let i = index + 1; i < start + count; ++i) {
        if (!headerStacksAreEqual(getHeader(i), header, dimensionLevel)) {
            break
        }
        ++span
    }

    const currentHeader = header[dimensionLevel]

    const includesHierarchy = showHierarchy && currentHeader?.hierarchy

    const label = includesHierarchy
        ? currentHeader.hierarchy.join(' / ')
        : currentHeader?.name

    return {
        span,
        label,
        includesHierarchy,
    }
}
