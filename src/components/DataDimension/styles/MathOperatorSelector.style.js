import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper {
        border: 1px solid ${colors.grey400};
        margin-top: ${spacers.dp8};
    }

    .operators {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacers.dp4};
        padding: ${spacers.dp4};
        border-top: 1px solid ${colors.grey400};
    }

    .sub-header {
        font-size: 14px;
        font-weight: normal;
        margin: ${spacers.dp4} ${spacers.dp8};
    }

    .operator {
        display: inline-block;
        background: ${colors.grey200};
        padding: ${spacers.dp4} ${spacers.dp8};
        border-radius: 3px;
        font-size: 14px;
        line-height: 16px;
    }
`
