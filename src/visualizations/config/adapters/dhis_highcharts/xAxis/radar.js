import isString from 'd2-utilizr/lib/isString'
import {
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    TEXT_ALIGN_CENTER,
} from '../../../../../modules/fontStyle'
import { isVerticalType, VIS_TYPE_RADAR } from '../../../../../modules/visTypes'
import { getTextAlignOption } from '../getTextAlignOption'
import { getDefault } from './'

export default (store, layout) => {
    const config = getDefault(store, layout)

    if (
        isString(config.title?.text) &&
        config.title.align ===
            getTextAlignOption(
                TEXT_ALIGN_CENTER,
                FONT_STYLE_HORIZONTAL_AXIS_TITLE,
                isVerticalType(VIS_TYPE_RADAR)
            )
    ) {
        config.title.textAlign = 'right'
    }

    return config
}
