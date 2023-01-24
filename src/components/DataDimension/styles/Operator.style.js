import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .operator {
        display: inline-block;
        background: ${colors.grey200};
        padding: ${spacers.dp4} ${spacers.dp8};
        border-radius: 3px;
        font-size: 14px;
        line-height: 16px;
        cursor: default;
        user-select: none;
    }
`
