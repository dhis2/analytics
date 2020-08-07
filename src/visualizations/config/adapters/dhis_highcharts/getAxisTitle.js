import isString from 'd2-utilizr/lib/isString'
import { 
    FONT_STYLE_OPTION_FONT_SIZE, 
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_BOLD ,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    getVerticalOptionFromTextAlignOption
} from '../../../../modules/fontStyle'

const getTitleStyle = fontStyle => fontStyle ? {
    align: getVerticalOptionFromTextAlignOption(fontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]),
    margin: 15,
    style: {
        color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
        textShadow: '0 0 #999',
        fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
        fontWeight: fontStyle[FONT_STYLE_OPTION_BOLD] ? FONT_STYLE_OPTION_BOLD : 'normal',
        fontStyle: fontStyle[FONT_STYLE_OPTION_ITALIC] ? FONT_STYLE_OPTION_ITALIC : 'normal'
    },
} : {}

export default function(title, fontStyle) {
    return isString(title)
        ? Object.assign({}, getTitleStyle(fontStyle), {
              text: title,
          })
        : {
              text: null,
          }
}
