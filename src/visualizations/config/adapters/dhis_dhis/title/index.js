import { VIS_TYPE_SINGLE_VALUE } from '../../../../../modules/visTypes.js'
import getFilterText from '../../../../util/getFilterText.js'
import getSingleValueTitle from './singleValue.js'

function getDefault(layout, metaData, dashboard) {
    return layout.filters && !dashboard
        ? getFilterText(layout.filters, metaData)
        : ''
}

export default function (layout, metaData, dashboard) {
    if (layout.hideTitle) {
        return ''
    }

    if (typeof layout.title === 'string' && layout.title.length) {
        return layout.title
    } else {
        let title
        switch (layout.type) {
            case VIS_TYPE_SINGLE_VALUE:
                title = getSingleValueTitle(layout, metaData)

                break
            default:
                title = getDefault(layout, metaData, dashboard)
        }
        return title
    }
}
