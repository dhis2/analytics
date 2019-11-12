import objectClean from 'd2-utilizr/lib/objectClean'
import getAxisTitle from '../getAxisTitle'
import getCategories from '../getCategories'
import getYearOnYear from './yearOnYear'
import {
    VIS_TYPE_GAUGE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_PIE,
} from '../../../../../modules/visTypes'

function noAxis() {
    return null
}

function getDefault(store, layout) {
    return objectClean({
        categories: getCategories(store.data[0].metaData, layout),
        title: getAxisTitle(layout.domainAxisLabel),
        labels: {
            style: {
                color: '#666',
                textShadow: '0 0 #ccc',
            },
        },
    })
}

export default function(store, layout, extraOptions) {
    let xAxis

    switch (layout.type) {
        case VIS_TYPE_PIE:
        case VIS_TYPE_GAUGE:
            xAxis = noAxis()
            break
        case VIS_TYPE_YEAR_OVER_YEAR_LINE:
        case VIS_TYPE_YEAR_OVER_YEAR_COLUMN:
            xAxis = getYearOnYear(store, layout, extraOptions)
            break
        default:
            xAxis = getDefault(store, layout)
    }

    return xAxis
}
