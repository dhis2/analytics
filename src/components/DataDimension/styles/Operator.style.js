import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .number {
        padding: 0 ${spacers.dp4};
    }

    .operator:hover,
    .number:hover {
        background: ${colors.grey300};
    }
`
