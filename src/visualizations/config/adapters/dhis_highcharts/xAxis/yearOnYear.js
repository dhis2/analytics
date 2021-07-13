import objectClean from 'd2-utilizr/lib/objectClean'
import {
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    FONT_STYLE_CATEGORY_AXIS_LABELS,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_BOLD,
    FONT_STYLE_OPTION_ITALIC
} from '../../../../../modules/fontStyle'
import getAxisTitle from '../getAxisTitle'

export default function (store, layout, extraOptions) {
    let categories

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

    const labelFontStyle = layout.fontStyle[FONT_STYLE_CATEGORY_AXIS_LABELS]

    return objectClean({
        categories,
        title: getAxisTitle(layout.domainAxisLabel, layout.fontStyle[FONT_STYLE_HORIZONTAL_AXIS_TITLE], FONT_STYLE_HORIZONTAL_AXIS_TITLE, layout.type),
        labels: labelFontStyle ? {
            style: {
                color: labelFontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
                fontSize: `${labelFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
                fontWeight: labelFontStyle[FONT_STYLE_OPTION_BOLD] ? FONT_STYLE_OPTION_BOLD : 'normal',
                fontStyle: labelFontStyle[FONT_STYLE_OPTION_ITALIC] ? FONT_STYLE_OPTION_ITALIC : 'normal'
            },
        } : {},
    })
}
