import css from 'styled-jsx/css'
import { colors, spacers, theme } from '@dhis2/ui-core'

export default css`
    .wrapper:last-child {
        margin-bottom: ${spacers.dp4};
    }
    .chip {
        display: inline-block;
        background: ${colors.grey200};
        font-size: 14px;
        line-height: 16px;
        padding: 2px ${spacers.dp8} 2px ${spacers.dp4};
        margin-top: ${spacers.dp4};
        margin-left: ${spacers.dp8};
        border-radius: 3px;
        user-select: none;
    }

    .chip:hover {
        background: ${colors.grey300};
    }

    .chip.highlighted {
        background: ${theme.secondary800};
        color: ${colors.white};
    }

    .chip.highlighted :global(.icon path) {
        fill: ${colors.white};
    }

    .chip.disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .icon,
    .label {
        line-height: 18px;
    }

    .icon {
        margin-right: ${spacers.dp4};
        display: inline-flex;
        vertical-align: text-bottom;
    }

    .label {
        font-size: 14px;
    }
`
