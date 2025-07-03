import { isNumeric } from '../../../../modules/utils.js'

export default function (axis) {
    const decimals = axis.decimals
    return isNumeric(decimals)
        ? {
              formatter: function () {
                  return this.value.toFixed(decimals)
              },
          }
        : {}
}
