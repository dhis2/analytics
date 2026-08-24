import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: ${spacers.dp8};
        padding: ${spacers.dp8};
    }

    .divider {
        align-self: stretch;
        width: 1px;
        background: ${colors.grey400};
    }
`
