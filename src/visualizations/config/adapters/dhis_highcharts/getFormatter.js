import isNumeric from 'd2-utilizr/lib/isNumeric'

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
