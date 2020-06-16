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
    const metadata = store.data[0].metaData
    const categoriesCount = layout.rows.length

    const getCategoryNames = (index = 0) => {
        const categoryId = layout.rows[index].dimension
        const categoryItemIds = metadata.dimensions[categoryId]

        return categoriesCount - 1 > index
            ? categoryItemIds.map(categoryItemId => ({
                  name: metadata.items[categoryItemId].name,
                  categories: getCategoryNames(index + 1, metadata),
              }))
            : getCategories(metadata, categoryId)
    }

    return objectClean({
        categories: getCategoryNames(),
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
