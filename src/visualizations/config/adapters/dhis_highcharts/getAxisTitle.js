import isString from 'd2-utilizr/lib/isString'
import { FONT_STYLE_OPTION_FONT_SIZE, FONT_STYLE_OPTION_TEXT_COLOR } from '../../../../modules/fontStyle'


const getTitleStyle = fontStyle => fontStyle ? {
    align: 'low',
    margin: 15,
    style: {
        color: fontStyle[FONT_STYLE_OPTION_TEXT_COLOR],
        textShadow: '0 0 #999',
        fontSize: `${fontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`,
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
