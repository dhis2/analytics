import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-toolbar {
        padding: ${spacers.dp8};
    }

    .buttons-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: ${spacers.dp8};
    }

    .divider {
        align-self: stretch;
        width: 1px;
        background: ${colors.grey400};
    }

    .status {
        display: inline-flex;
        align-items: center;
        gap: ${spacers.dp4};
        margin-top: ${spacers.dp4};
    }

    .status-text {
        color: ${colors.red700};
        font-size: 14px;
        line-height: 19px;
    }

    .valid .status-text {
        color: ${colors.green700};
    }
`
