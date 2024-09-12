import { VIS_TYPE_SINGLE_VALUE } from '../../../../modules/visTypes.js'

export default function (visualizationType) {
    return {
        style: {
            fontSize: '13px',
            fontWeight: 'normal',
            /* Hide no data label for single value visualizations because
             * the data is always missing. */
            opacity: visualizationType === VIS_TYPE_SINGLE_VALUE ? 0 : 1,
        },
    }
}
