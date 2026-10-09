import { spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-toolbar {
        padding: ${spacers.dp8};
        flex-shrink: 0;
    }

    .buttons-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: ${spacers.dp8};
    }
`
