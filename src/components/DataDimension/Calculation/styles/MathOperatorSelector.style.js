import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper {
        border-bottom: 1px solid ${colors.grey400};
    }

    .operators {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacers.dp4};
        padding: ${spacers.dp8};
    }
`
