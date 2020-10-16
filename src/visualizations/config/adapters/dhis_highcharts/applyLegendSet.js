import isNumeric from 'd2-utilizr/lib/isNumeric'

import { getColorByValueFromLegendSet } from "../../../../modules/legends"
import { VIS_TYPE_LINE } from '../../../../modules/visTypes'
import getType from './type'

export default (series, legendSet) =>
    series.map(seriesObj =>
        seriesObj.type !== getType(VIS_TYPE_LINE).type
            ? {
                  ...seriesObj,
                  data: seriesObj.data.map(value =>
                      isNumeric(value)
                          ? {
                                y: value,
                                color: getColorByValueFromLegendSet(
                                    legendSet,
                                    value
                                ),
                            }
                          : value
                  ),
              }
            : { ...seriesObj }
    )
