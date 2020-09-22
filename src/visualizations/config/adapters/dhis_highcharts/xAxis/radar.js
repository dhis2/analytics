import isString from 'd2-utilizr/lib/isString'
import objectClean from 'd2-utilizr/lib/objectClean'
import { FONT_STYLE_CATEGORY_AXIS_LABELS, FONT_STYLE_HORIZONTAL_AXIS_TITLE, FONT_STYLE_OPTION_TEXT_ALIGN, TEXT_ALIGN_CENTER } from '../../../../../modules/fontStyle'
import getAxisTitle from '../getAxisTitle'
import getCategories from '../getCategories'
import { getLabelsStyle } from './'

export default (store, layout) => {
    const config = objectClean({
        categories: getCategories(store.data[0].metaData, layout.rows[0].dimension),
        title: getAxisTitle(layout.domainAxisLabel, layout.fontStyle[FONT_STYLE_HORIZONTAL_AXIS_TITLE], FONT_STYLE_HORIZONTAL_AXIS_TITLE, layout.type),
        labels: getLabelsStyle(layout.fontStyle[FONT_STYLE_CATEGORY_AXIS_LABELS]), 
    })

    if (isString(layout.domainAxisLabel) && config.title && layout.fontStyle[FONT_STYLE_HORIZONTAL_AXIS_TITLE][FONT_STYLE_OPTION_TEXT_ALIGN] === TEXT_ALIGN_CENTER) {
        config.title.textAlign = 'right'
    }
    
    return config
}
