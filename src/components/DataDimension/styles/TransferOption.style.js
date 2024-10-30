import { colors, spacers, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper:last-child {
        margin-bottom: ${spacers.dp4};
    }
    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        //background: ${colors.grey200};
        font-size: 14px;
        line-height: 16px;
        border-bottom: 1px solid ${colors.grey400};
        padding: 6px ${spacers.dp4};
        //margin: ${spacers.dp4} ${spacers.dp8} 0 ${spacers.dp8};
        user-select: none;
    }

    .item:hover {
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

    .group {
        display: inline-flex;
    }

    .nowrap {
        flex-shrink: 0;
    }

    .icon,
    .label {
        line-height: 18px;
    }

    .icon {
        margin-right: ${spacers.dp4};
        display: inline-flex;
        vertical-align: text-bottom;
        //padding-top: 1px;
    }

    .label {
        font-size: 14px;
    }

    .type {
        font-size: 12px;
        font-family: monospace;
    }

    .edit,
    .info {
        height: 16px;
        margin-top: 1px;
        margin-left: ${spacers.dp8};
        cursor: pointer;
    }

    .info {
        margin-left: ${spacers.dp4};
    }

    .edit:hover,
    .info:hover {
        background-color: rgba(0, 0, 0, 0.12);
        outline: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 3px;
    }

    .highlighted .edit:hover,
    .highlighted .info:hover {
        background-color: rgba(255, 255, 255, 0.12);
        outline: 1px solid rgba(255, 255, 255, 0.12);
    }
`
