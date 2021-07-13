import objectClean from 'd2-utilizr/lib/objectClean'
import {
    FONT_STYLE_VERTICAL_AXIS_TITLE,
    mergeFontStyleWithDefault,
} from '../../../../../modules/fontStyle'
import { getAxis } from '../../../../util/axes'
import getAxisTitle from '../getAxisTitle'
import { getLabels } from '.'

export default function (store, layout, extraOptions) {
    let categories
    const AXIS_TYPE = 'DOMAIN'
    const AXIS_INDEX = 0
    const axis = getAxis(layout.axes, AXIS_TYPE, AXIS_INDEX)

    if (extraOptions.xAxisLabels) {
        categories = extraOptions.xAxisLabels
    } else {
        // look for the response with the longer list of periods.
        // in some cases (ie. weeks per year) responses might have a different number of periods in metadata
        const res = store.data.reduce((out, r) => {
            if (out) {
                if (
                    r.metaData.dimensions.pe.length >
                    out.metaData.dimensions.pe.length
                ) {
                    out = r
                }
            } else {
                out = r
            }

            return out
        }, {})

        const metaData = res.metaData

        categories = metaData.dimensions.pe.reduce((categories, periodId) => {
            // TODO use shortName or pass extra option to the request for getting short names in name prop
            categories.push(metaData.items[periodId].name)
            return categories
        }, [])
    }

    return objectClean({
        categories,
        title: getAxisTitle(
            axis.title?.text,
            mergeFontStyleWithDefault(
                axis.title?.fontStyle,
                FONT_STYLE_VERTICAL_AXIS_TITLE
            ),
            FONT_STYLE_VERTICAL_AXIS_TITLE,
            layout.type
        ),
        labels: getLabels(axis),
    })
}
