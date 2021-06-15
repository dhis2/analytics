import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    div {
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        text-decoration: none;
        color: ${colors.grey900};
        padding: ${spacers.dp8} ${spacers.dp12};
    }

    div:hover {
        background-color: ${colors.grey200};
    }

    div:active,
    div.active {
        background-color: ${colors.teal700};
        color: ${colors.white};
        cursor: auto;
    }

    div.disabled {
        color: ${colors.grey500};
        cursor: not-allowed;
        user-select: none;
    }

    div.disabled:hover {
        background-color: initial;
    }

    span.label {
        margin-left: ${spacers.dp8};
    }
`
