import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper {
        height: 120px;
        border: 2px solid ${colors.grey200};
        padding: ${spacers.dp4};
    }

    .operators {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacers.dp4};
        padding: ${spacers.dp4};
        border-top: 1px solid ${colors.grey400};
    }

    .operator {
        display: inline-block;
        background: ${colors.grey200};
        padding: ${spacers.dp4} ${spacers.dp8};
        border-radius: 3px;
        font-size: 14px;
        line-height: 16px;
    }

    .part {
        display: inline-block;
        background: ${colors.grey200};
        font-size: 14px;
        line-height: 16px;
        padding: 2px ${spacers.dp4};
        margin: ${spacers.dp4} ${spacers.dp4} 0 0;
        border-radius: 3px;
        user-select: none;
    }
`
