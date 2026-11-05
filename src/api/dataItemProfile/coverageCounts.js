/* A coverage's counts, by org unit id or group key (getGroupCountsKey):
 * `{ totals: { [level]: n }, sources: { [sourceId]: { byLevel: { [level]: n },
 * ancestors } } }`. A count query is keyed `[countsKey, what, level]`: `what`
 * is 'total' or a source id, `level` a level or 'ancestors'. A count missing
 * from the counts hasn't been fetched; 0 has. */

export const recordCount = (counts, [countsKey, what, level], total) => {
    counts[countsKey] ??= { totals: {}, sources: {} }

    const counted = counts[countsKey]

    if (what === 'total') {
        counted.totals[level] = total
        return
    }

    counted.sources[what] ??= { byLevel: {} }

    const source = counted.sources[what]

    // A group's ancestors are counted level by level, and add up
    if (level === 'ancestors') {
        source.ancestors = (source.ancestors ?? 0) + total
    } else {
        source.byLevel[level] = total
    }
}

// Whether a count query is answered in `counts` already
export const isCounted = (counts, [countsKey, what, level]) => {
    const counted = counts?.[countsKey]

    if (what === 'total') {
        return counted?.totals?.[level] !== undefined
    }

    const source = counted?.sources?.[what]

    return level === 'ancestors'
        ? source?.ancestors !== undefined
        : source?.byLevel?.[level] !== undefined
}

const mergeSources = (sources = {}, newSources = {}) =>
    Object.fromEntries(
        [...new Set([...Object.keys(sources), ...Object.keys(newSources)])].map(
            (id) => [
                id,
                {
                    ...sources[id],
                    ...newSources[id],
                    byLevel: {
                        ...sources[id]?.byLevel,
                        ...newSources[id]?.byLevel,
                    },
                },
            ]
        )
    )

// The counts of both, the new ones last
export const mergeCounts = (counts = {}, newCounts = {}) =>
    Object.fromEntries(
        [...new Set([...Object.keys(counts), ...Object.keys(newCounts)])].map(
            (countsKey) => [
                countsKey,
                {
                    totals: {
                        ...counts[countsKey]?.totals,
                        ...newCounts[countsKey]?.totals,
                    },
                    sources: mergeSources(
                        counts[countsKey]?.sources,
                        newCounts[countsKey]?.sources
                    ),
                },
            ]
        )
    )
