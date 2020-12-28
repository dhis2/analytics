import isNumeric from 'd2-utilizr/lib/isNumeric'

import { getAxis } from '../../../util/axes'

export default function (axes = [], axisType, axisIndex) {
    const decimals = getAxis(axes, axisType, axisIndex).decimals
    return isNumeric(decimals)
        ? {
              formatter: function () {
                  return this.value.toFixed(decimals)
              },
          }
        : {}
}
