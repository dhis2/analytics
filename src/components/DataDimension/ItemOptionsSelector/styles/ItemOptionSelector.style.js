import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .option-set-back-button {
        margin: 0 -${spacers.dp8};
        padding: ${spacers.dp8};
        background: ${colors.grey200};
        border-bottom: 1px solid ${colors.grey400};
    }

    .option-set-name {
        font-size: 14px;
        font-weight: 500;
        padding: ${spacers.dp12} 0;
    }
`
