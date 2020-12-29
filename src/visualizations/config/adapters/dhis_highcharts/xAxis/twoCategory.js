import getAxisTitle from '../getAxisTitle'
import getCategories from '../getCategories'
import { getLabels } from './'
import {
    defaultFontStyle,
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
} from '../../../../../modules/fontStyle'
import { getAxis } from '../../../../util/axes'

const AXIS_TYPE = 'DOMAIN'
const AXIS_INDEX = 0

export default function (store, layout) {
    const axis1Categories = getCategories(
        store.data[0].metaData,
        layout.rows[1].dimension
    )

    const axis2Categories = getCategories(
        store.data[0].metaData,
        layout.rows[0].dimension
    )

    const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)

    // bottom x axis
    const xAxis = [
        {
            title: getAxisTitle(
                axis.title?.text,
                {
                    ...defaultFontStyle[FONT_STYLE_HORIZONTAL_AXIS_TITLE],
                    ...axis.title?.fontStyle,
                },
                FONT_STYLE_HORIZONTAL_AXIS_TITLE,
                layout.type
            ),
            categories: Array.from(
                { length: axis2Categories.length || 1 },
                () => axis1Categories
            ),
            labels: getLabels(axis),
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
