import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .dragging-item {
        display: inline-flex;
        background: ${colors.grey200};
        border-radius: 2px;
        font-size: 14px;
        line-height: 16px;
        cursor: pointer;
        user-select: none;
        align-items: center;
        border: 2px solid ${colors.blue500};
    }

    .operator,
    .number {
        padding: ${spacers.dp4} ${spacers.dp8};
    }

    .data {
        padding: ${spacers.dp4};
    }

    .icon {
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        margin-right: ${spacers.dp4};
    }
`
