import isString from 'd2-utilizr/lib/isString'

const DEFAULT_AXIS_TITLE = {
    align: 'low',
    margin: 15,
    style: {
        color: '#222',
        textShadow: '0 0 #999',
        fontSize: '13px',
    },
}

export default function(title) {
    return isString(title)
        ? Object.assign({}, DEFAULT_AXIS_TITLE, {
              text: title,
          })
        : {
              text: null,
          }
}
