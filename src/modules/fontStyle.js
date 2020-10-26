/*eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'

import { isVerticalType } from './visTypes'

// Font styles
export const FONT_STYLE_VISUALIZATION_TITLE = 'visualizationTitle'
export const FONT_STYLE_VISUALIZATION_SUBTITLE = 'visualizationSubtitle'
export const FONT_STYLE_HORIZONTAL_AXIS_TITLE = 'horizontalAxisTitle'
export const FONT_STYLE_VERTICAL_AXIS_TITLE = 'verticalAxisTitle'
export const FONT_STYLE_LEGEND = 'legend'
export const FONT_STYLE_SERIES_AXIS_LABELS = 'seriesAxisLabel'
export const FONT_STYLE_CATEGORY_AXIS_LABELS = 'categoryAxisLabel'
export const FONT_STYLE_TARGET_LINE_LABEL = 'targetLineLabel'
export const FONT_STYLE_BASE_LINE_LABEL = 'baseLineLabel'
// Options
export const FONT_STYLE_OPTION_FONT = 'font'
export const FONT_STYLE_OPTION_FONT_SIZE = 'fontSize'
export const FONT_STYLE_OPTION_BOLD = 'bold'
export const FONT_STYLE_OPTION_ITALIC = 'italic'
export const FONT_STYLE_OPTION_UNDERLINE = 'underline'
export const FONT_STYLE_OPTION_TEXT_COLOR = 'textColor'
export const FONT_STYLE_OPTION_TEXT_ALIGN = 'textAlign'
// Text align
export const TEXT_ALIGN_LEFT = 'LEFT'
export const TEXT_ALIGN_CENTER = 'CENTER'
export const TEXT_ALIGN_RIGHT = 'RIGHT'

// Tiers
const TIER1 = 'tier1'
const TIER2 = 'tier2'

export const getFontSizeOptions = fontStyleKey => {
    const fontSizes = [
        {
            key: 'xSmall',
            label: i18n.t('Extra Small'),
            [TIER1]: 11,
            [TIER2]: 9,
        },
        {
            key: 'small',
            label: i18n.t('Small'),
            [TIER1]: 13,
            [TIER2]: 11,
        },
        {
            key: 'regular',
            label: i18n.t('Regular'),
            [TIER1]: 18,
            [TIER2]: 13,
        },
        {
            key: 'large',
            label: i18n.t('Large'),
            [TIER1]: 27,
            [TIER2]: 18,
        },
        {
            key: 'xLarge',
            label: i18n.t('Extra Large'),
            [TIER1]: 42,
            [TIER2]: 24,
        },
    ]

    const tier = [
        FONT_STYLE_VISUALIZATION_TITLE,
        FONT_STYLE_VISUALIZATION_SUBTITLE,
    ].includes(fontStyleKey)
        ? TIER1
        : TIER2

    const result = {}
    fontSizes.forEach(size => {
        result[size.key] = {
            label: size.label,
            value: size[tier],
        }
    })
    return result
}

export const getTextAlignOptions = (fontStyleKey, visType) => {
    switch (fontStyleKey) {
        case FONT_STYLE_HORIZONTAL_AXIS_TITLE:
        case FONT_STYLE_VERTICAL_AXIS_TITLE:
            return axisTitleAlignOptions()
        case FONT_STYLE_TARGET_LINE_LABEL:
        case FONT_STYLE_BASE_LINE_LABEL:
            return isVerticalType(visType)
                ? verticalAlignOptions()
                : defaultAlignOptions()
        case FONT_STYLE_VISUALIZATION_TITLE:
        case FONT_STYLE_VISUALIZATION_SUBTITLE:
        case FONT_STYLE_LEGEND:
        default:
            return defaultAlignOptions()
    }
}

const defaultAlignOptions = () => [
    {
        label: i18n.t('Left'),
        value: TEXT_ALIGN_LEFT,
    },
    {
        label: i18n.t('Center'),
        value: TEXT_ALIGN_CENTER,
    },
    {
        label: i18n.t('Right'),
        value: TEXT_ALIGN_RIGHT,
    },
]

const axisTitleAlignOptions = () => [
    {
        label: i18n.t('Start'),
        value: TEXT_ALIGN_LEFT,
    },
    {
        label: i18n.t('Middle'),
        value: TEXT_ALIGN_CENTER,
    },
    {
        label: i18n.t('End'),
        value: TEXT_ALIGN_RIGHT,
    },
]

const verticalAlignOptions = () => [
    {
        label: i18n.t('Top'),
        value: TEXT_ALIGN_LEFT,
    },
    {
        label: i18n.t('Middle'),
        value: TEXT_ALIGN_CENTER,
    },
    {
        label: i18n.t('Bottom'),
        value: TEXT_ALIGN_RIGHT,
    },
]

const defaultFont = 'Roboto'

export const defaultFontStyle = {
    [FONT_STYLE_VISUALIZATION_TITLE]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(
            FONT_STYLE_VISUALIZATION_TITLE
        ).regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey900,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_CENTER,
    },
    [FONT_STYLE_VISUALIZATION_SUBTITLE]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(
            FONT_STYLE_VISUALIZATION_SUBTITLE
        ).small.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey700,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_CENTER,
    },
    [FONT_STYLE_HORIZONTAL_AXIS_TITLE]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(
            FONT_STYLE_HORIZONTAL_AXIS_TITLE
        ).regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey900,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_CENTER,
    },
    [FONT_STYLE_VERTICAL_AXIS_TITLE]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(
            FONT_STYLE_VERTICAL_AXIS_TITLE
        ).regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey900,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_CENTER,
    },
    [FONT_STYLE_LEGEND]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(FONT_STYLE_LEGEND)
            .regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey900,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_CENTER,
    },
    [FONT_STYLE_SERIES_AXIS_LABELS]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(
            FONT_STYLE_SERIES_AXIS_LABELS
        ).small.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey800,
    },
    [FONT_STYLE_CATEGORY_AXIS_LABELS]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(
            FONT_STYLE_CATEGORY_AXIS_LABELS
        ).small.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey800,
    },
    [FONT_STYLE_TARGET_LINE_LABEL]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(
            FONT_STYLE_TARGET_LINE_LABEL
        ).regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey900,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_LEFT,
    },
    [FONT_STYLE_BASE_LINE_LABEL]: {
        [FONT_STYLE_OPTION_FONT]: defaultFont,
        [FONT_STYLE_OPTION_FONT_SIZE]: getFontSizeOptions(
            FONT_STYLE_BASE_LINE_LABEL
        ).regular.value,
        [FONT_STYLE_OPTION_BOLD]: false,
        [FONT_STYLE_OPTION_ITALIC]: false,
        [FONT_STYLE_OPTION_UNDERLINE]: false,
        [FONT_STYLE_OPTION_TEXT_COLOR]: colors.grey900,
        [FONT_STYLE_OPTION_TEXT_ALIGN]: TEXT_ALIGN_LEFT,
    },
}

export const mergeFontStyleWithDefault = fontStyle => {
    const result = { ...defaultFontStyle }
    for (const style in fontStyle) {
        result[style] = {
            ...result[style],
            ...fontStyle[style],
        }
    }
    return result
}

export const deleteFontStyleOption = (inputFontStyle, fontStyleKey, option) => {
    const style = {
        ...inputFontStyle,
        [fontStyleKey]: {
            ...inputFontStyle[fontStyleKey],
        },
    }
    style[fontStyleKey] && delete style[fontStyleKey][option]
    !Object.keys(style[fontStyleKey]).length && delete style[fontStyleKey]
    return Object.keys(style).length ? style : null
}
