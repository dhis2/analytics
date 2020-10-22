import getAxisTitle from '../getAxisTitle'
import getCategories from '../getCategories'
import { getLabelsStyle } from './'
import {
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    FONT_STYLE_CATEGORY_AXIS_LABELS,
} from '../../../../../modules/fontStyle'


export default function(store, layout) {
    const axis1Categories = getCategories(
        store.data[0].metaData,
        layout.rows[1].dimension
    )

    const axis2Categories = getCategories(
        store.data[0].metaData,
        layout.rows[0].dimension
    )

    // bottom x axis
    const xAxis = [
        {
            title: getAxisTitle(layout.domainAxisLabel, layout.fontStyle[FONT_STYLE_HORIZONTAL_AXIS_TITLE], FONT_STYLE_HORIZONTAL_AXIS_TITLE, layout.type),
            categories: Array.from(
                { length: axis2Categories.length || 1 },
                () => axis1Categories
            ),
            labels: getLabelsStyle(layout.fontStyle[FONT_STYLE_CATEGORY_AXIS_LABELS]),
        },
    ]

    // top x axis
    xAxis.push({
        categories: axis2Categories,
        labels: xAxis[0].labels,
        gridLineWidth: 1,
        opposite: 'true',
    })

    return xAxis
}
