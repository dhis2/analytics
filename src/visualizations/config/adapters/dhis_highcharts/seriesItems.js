export const SERIES_ITEM_SERIES = 'series'
export const SERIES_ITEM_AXIS = 'axis'

// returns:
// {
//     a: 1,
//     b: 1,
// }
export function getIdAxisMap(seriesItems) {
    return seriesItems.reduce((map, item) => {
        map[item[SERIES_ITEM_SERIES]] = item[SERIES_ITEM_AXIS]
        return map
    }, {})
}

export function getFullIdAxisMap(seriesItems, series) {
    const idAxisMap = getIdAxisMap(seriesItems)

    // adds first axis ids to seriesAxisMap
    series.forEach(s => {
        if (!(s.id in idAxisMap)) {
            idAxisMap[s.id] = 0
        }
    })

    return idAxisMap
}

// returns: true or false
export function hasExtraAxis(seriesItems) {
    return Boolean(Object.keys(getIdAxisMap(seriesItems)).length)
}

// returns: true or false
export function hasExtraAxisItems(seriesItems, columns) {
    const axisIds = Object.keys(getIdAxisMap(seriesItems))
    const seriesIds = columns.reduce((all, dim) => {
        all.push(...dim.items.map(item => item.id))
        return all
    }, [])

    return axisIds.find(id => seriesIds.includes(id))
}

// returns:
// {
//     0: ['a', 'b'],
//     1: ['c'],
// }
export function getAxisIdsMap(seriesItems, series) {
    const fullIdAxisMap = getFullIdAxisMap(seriesItems, series)

    return Object.entries(fullIdAxisMap).reduce((map, [id, axis]) => {
        if (!(axis in map)) {
            map[axis] = []
        }

        map[axis].push(id)
        return map
    }, {})
}
