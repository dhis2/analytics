import css from 'styled-jsx/css'
import { colors, spacers, theme } from '@dhis2/ui'

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

    .selected {
        background: ${theme.secondary100};
        color: ${theme.secondary900};
    }

    .selected :global(.icon path) {
        fill: ${theme.secondary700};
    }

    .selected:hover {
        background: #c9edeb;
    }

    .highlighted,
    .highlighted:hover {
        background: ${theme.secondary800};
        color: ${colors.white};
    }

    .highlighted :global(.icon path) {
        fill: ${colors.white};
    }

    .disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .inactive {
        opacity: 0.3;
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
