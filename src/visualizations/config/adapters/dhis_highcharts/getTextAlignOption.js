import {
    TEXT_ALIGN_LEFT,
    TEXT_ALIGN_CENTER,
    TEXT_ALIGN_RIGHT,
    FONT_STYLE_HORIZONTAL_AXIS_TITLE,
    FONT_STYLE_VERTICAL_AXIS_TITLE,
    FONT_STYLE_REGRESSION_LINE_LABEL,
    FONT_STYLE_VISUALIZATION_TITLE,
    FONT_STYLE_VISUALIZATION_SUBTITLE,
    FONT_STYLE_LEGEND,
} from '../../../../modules/fontStyle'

const defaultAlignOptions = {
    [TEXT_ALIGN_LEFT]: 'left',
    [TEXT_ALIGN_CENTER]: 'center',
    [TEXT_ALIGN_RIGHT]: 'right',
}

const axisTitleAlignOptions = {
    [TEXT_ALIGN_LEFT]: 'low',
    [TEXT_ALIGN_CENTER]: 'middle',
    [TEXT_ALIGN_RIGHT]: 'high',
}

const verticalAlignOptions = {
    [TEXT_ALIGN_LEFT]: 'top',
    [TEXT_ALIGN_CENTER]: 'middle',
    [TEXT_ALIGN_RIGHT]: 'bottom',
}

const getTextAlignOptions = (fontStyleKey, isVertical) => {
    switch (fontStyleKey) {
        case FONT_STYLE_HORIZONTAL_AXIS_TITLE:
        case FONT_STYLE_VERTICAL_AXIS_TITLE:
            return axisTitleAlignOptions
        case FONT_STYLE_REGRESSION_LINE_LABEL:
            return isVertical ? verticalAlignOptions : defaultAlignOptions
        case FONT_STYLE_VISUALIZATION_TITLE:
        case FONT_STYLE_VISUALIZATION_SUBTITLE:
        case FONT_STYLE_LEGEND:
        default:
            return defaultAlignOptions
    }
}

export const getTextAlignOption = (option, fontStyleKey, isVertical) =>
    getTextAlignOptions(fontStyleKey, isVertical)[option]
