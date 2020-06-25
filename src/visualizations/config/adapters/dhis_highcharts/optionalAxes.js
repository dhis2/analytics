export const OPTIONAL_AXES_DIMENSIONAL_ITEM = 'dimensionalItem'
export const OPTIONAL_AXES_AXIS = 'axis'

// returns:
// {
//     a: 1,
//     b: 1,
// }
export function getIdAxisMap(optionalAxes) {
    return optionalAxes.reduce((map, item) => {
        map[item[OPTIONAL_AXES_DIMENSIONAL_ITEM]] = item[OPTIONAL_AXES_AXIS]
        return map
    }, {})
}

export function getFullIdAxisMap(optionalAxes, series) {
    const idAxisMap = getIdAxisMap(optionalAxes)

    // adds first axis ids to seriesAxisMap
    series.forEach(s => {
        if (!(s.id in idAxisMap)) {
            idAxisMap[s.id] = 0
        }
    })

    return idAxisMap
}

// returns: true or false
export function hasOptionalAxis(optionalAxes) {
    return Boolean(optionalAxes.length) && optionalAxes.some(item => item.axis > 0)
}

// returns: true or false
export function hasOptionalAxisItems(optionalAxes, columns) {
    const axisIds = Object.keys(getIdAxisMap(optionalAxes))
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
export function getAxisIdsMap(optionalAxes, series) {
    const fullIdAxisMap = getFullIdAxisMap(optionalAxes, series)

    return Object.entries(fullIdAxisMap).reduce((map, [id, axis]) => {
        if (!(axis in map)) {
            map[axis] = []
        }

        map[axis].push(id)
        return map
    }, {})
}
