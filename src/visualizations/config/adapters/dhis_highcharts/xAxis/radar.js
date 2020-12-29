import isString from 'd2-utilizr/lib/isString'
import {
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    TEXT_ALIGN_CENTER,
} from '../../../../../modules/fontStyle'
import { getDefault } from './'

export default (store, layout) => {
    const config = getDefault(store, layout)

    if (
        isString(layout.domainAxisLabel) && //FIXME: Change to axis.title?.text
        config.title &&
        layout.fontStyle[FONT_STYLE_HORIZONTAL_AXIS_TITLE][
            FONT_STYLE_OPTION_TEXT_ALIGN
        ] === TEXT_ALIGN_CENTER
    ) {
        config.title.textAlign = 'right'
    }

    return config
}
