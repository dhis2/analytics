/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
import i18n from '@dhis2/d2-i18n'

export const FONT_STYLE_VISUALIZATION_TITLE = 'visualizationTitle'
export const FONT_STYLE_VISUALIZATION_SUBTITLE = 'visualizationSubtitle'
export const FONT_STYLE_HORIZONTAL_AXIS_TITLE = 'horizontalAxisTitle'
export const FONT_STYLE_VERTICAL_AXIS_TITLE = 'verticalAxisTitle'
export const FONT_STYLE_LEGEND = 'legend'
export const FONT_STYLE_OPTION_FONT = 'font'
export const FONT_STYLE_OPTION_FONT_SIZE = 'fontSize'
export const FONT_STYLE_OPTION_BOLD = 'bold'
export const FONT_STYLE_OPTION_ITALIC = 'italic'
export const FONT_STYLE_OPTION_UNDERLINE = 'underline'
export const FONT_STYLE_OPTION_TEXT_COLOR = 'textColor'
export const FONT_STYLE_OPTION_TEXT_ALIGN = 'textAlign'
export const TEXT_ALIGN_LEFT = 'LEFT'
export const TEXT_ALIGN_CENTER = 'CENTER'
export const TEXT_ALIGN_RIGHT = 'RIGHT'

export const getFontSizeOptions = () => ({
    xSmall: {
        label: i18n.t('Extra Small'),
        value: 9,
    },
    small: {
        label: i18n.t('Small'),
        value: 11,
    },
    regular: {
        label: i18n.t('Regular'),
        value: 13,
    },
    large: {
        label: i18n.t('Large'),
        value: 18,
    },
    xLarge: {
        label: i18n.t('Extra Large'),
        value: 24,
    },
})

export const getTextAlignOptions = () => ({
    [TEXT_ALIGN_LEFT]: {
        label: i18n.t('Left'),
        value: TEXT_ALIGN_LEFT,
    },
    [TEXT_ALIGN_CENTER]: {
        label: i18n.t('Center'),
        value: TEXT_ALIGN_CENTER,
    },
    [TEXT_ALIGN_RIGHT]: {
        label: i18n.t('Right'),
        value: TEXT_ALIGN_RIGHT,
    },
})

export const getVerticalOptionFromTextAlignOption = textAlignOption => {
    switch (textAlignOption) {
        case TEXT_ALIGN_LEFT:
        default:
            return 'low'
        case TEXT_ALIGN_CENTER:
            return 'middle'
        case TEXT_ALIGN_RIGHT:
            return 'high'
    }
}

const defaultFont = 'Roboto'
const defaultTextColor = '#000000'

export const defaultFontStyle = {
    [FONT_STYLE_VISUALIZATION_TITLE]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions().large.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: defaultTextColor,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_CENTER,
    },
    [FONT_STYLE_VISUALIZATION_SUBTITLE]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions().regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: defaultTextColor,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_CENTER,
    },
    [FONT_STYLE_HORIZONTAL_AXIS_TITLE]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions().regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: defaultTextColor,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_LEFT,
    },
    [FONT_STYLE_VERTICAL_AXIS_TITLE]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions().regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: defaultTextColor,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_LEFT,
    },
    [FONT_STYLE_LEGEND]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions().regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: defaultTextColor,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_CENTER,
    },
}

export const mergeFontStyleWithDefault = fontStyle => {
    const result = defaultFontStyle
    for (const style in fontStyle) {
        for (const option in fontStyle[style]) {
            if (result[style]) {
                result[style][option] = fontStyle[style][option]
            }
        }
    }
    //TODO: Remove console log
    console.log('---- RESULT ----')
    console.log(result)
    return result
}

// TODO: Change to a better name?
export const deleteFontStyleOption = (inputFontStyle, fontStyleKey, option) => {
    let fontStyle = { ...inputFontStyle }
    if (fontStyle[fontStyleKey]) {
        const { [option]: remove, ...rest } = fontStyle[fontStyleKey]
        fontStyle[fontStyleKey] = { ...rest }

        if (!Object.keys(fontStyle[fontStyleKey]).length) {
            const { [fontStyleKey]: remove, ...rest } = fontStyle
            fontStyle = { ...rest }
        }
    }
    if (!Object.keys(fontStyle).length) {
        fontStyle = null
    }

    return fontStyle
}
