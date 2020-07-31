export const CUSTOM_AXES_DIMENSION_ITEM = 'dimensionItem'
export const CUSTOM_AXES_AXIS = 'axis'

// returns:
// {
//     a: 1,
//     b: 1,
// }
export function getIdAxisMap(customAxes) {
    return customAxes.reduce((map, item) => {
        map[item[CUSTOM_AXES_DIMENSION_ITEM]] = item[CUSTOM_AXES_AXIS]
        return map
    }, {})
}

export function getFullIdAxisMap(customAxes = [], series = []) {
    const idAxisMap = getIdAxisMap(customAxes.filter(axisItem => series.find(seriesItem => seriesItem.id === axisItem.dimensionItem)))

    // adds first axis ids to seriesAxisMap
    series.forEach(s => {
        if (!(s.id in idAxisMap)) {
            idAxisMap[s.id] = 0
        }
    })

    return idAxisMap
}

// returns:
// {
//     0: ['a', 'b'],
//     1: ['c'],
// }
export function getAxisIdsMap(customAxes, series) {
    const fullIdAxisMap = getFullIdAxisMap(customAxes, series)

    return Object.entries(fullIdAxisMap).reduce((map, [id, axis]) => {
        if (!(axis in map)) {
            map[axis] = []
        }

        map[axis].push(id)
        return map
    }, {})
}
