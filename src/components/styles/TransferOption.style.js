import { colors, spacers, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper:last-child {
        margin-bottom: ${spacers.dp4};
    }
    .chip {
        display: inline-flex;
        background: ${colors.grey200};
        font-size: 14px;
        line-height: 16px;
        padding: 2px ${spacers.dp8} 2px ${spacers.dp4};
        margin: ${spacers.dp4} ${spacers.dp8} 0 ${spacers.dp8};
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
        padding-top: 1px;
    }

    .label {
        font-size: 14px;
    }

    .edit {
        height: 16px;
        margin-top: 1px;
        margin-left: ${spacers.dp8};
        cursor: pointer;
    }

    .edit:hover {
        background-color: rgba(0, 0, 0, 0.12);
        outline: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 3px;
    }

    .highlighted .edit:hover {
        background-color: rgba(255, 255, 255, 0.12);
        outline: 1px solid rgba(255, 255, 255, 0.12);
    }
`
