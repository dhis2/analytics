import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .dragging {
        border: 2px solid ${colors.blue500};
        cursor: grab;
    }

    .number {
        padding: 0 ${spacers.dp8};
    }
`
