import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper {
        position: relative;
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        gap: ${spacers.dp4} ${spacers.dp8};
        height: 120px;
        border: 2px solid ${colors.grey200};
        padding: ${spacers.dp4};
    }
`
