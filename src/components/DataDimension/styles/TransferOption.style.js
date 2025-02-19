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
        background: ${colors.white};
        font-size: 14px;
        line-height: 16px;
        border-bottom: 1px solid ${colors.grey300};
        user-select: none;
    }

    .item:hover {
        background: ${colors.grey100};
    }

    .disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .inactive {
        opacity: 0.3;
    }

    .labelGroup {
        display: inline-flex;
        margin: 6px 4px;
    }

    .typeGroup {
        display: inline-flex;
        margin: 6px 4px;
        align-self: stretch;
        align-items: center;
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
    }

    .label {
        font-size: 14px;
        color: ${colors.grey900};
    }

    .type {
        font-size: 10px;
        letter-spacing: -0.2px;
        color: ${colors.grey600};
        font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo,
            Consolas, 'DejaVu Sans Mono', monospace;
        font-weight: normal;
    }

    .edit,
    .info,
    .option-set-button {
        margin-left: ${spacers.dp8};
        cursor: pointer;
        color: ${colors.grey600};
    }

    .edit {
        height: 16px;
        line-height: 18px;
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .info {
        margin: 0 0 0 ${spacers.dp4};
        height: 100%;
        display: flex;
        align-items: center;
    }
    .info.active {
        background-color: ${colors.grey300};
        color: ${colors.grey900};
    }

    .option-set-button {
        border: 1px solid ${colors.grey300};
        border-radius: 2px;
        padding: 2px;
        height: 20px;
    }

    .highlighted {
        background: ${theme.secondary700};
    }
    .highlighted:hover {
        background: ${theme.secondary800};
    }

    .highlighted .edit,
    .highlighted .label {
        color: ${colors.white};
    }

    .highlighted .type,
    .highlighted .info {
        color: ${theme.secondary050};
    }

    .highlighted .type,
    .highlighted :global(.icon path),
    .highlighted :global(.edit path),
    .highlighted :global(.option-set-button path) {
        fill: ${colors.teal050};
    }

    .edit:hover,
    .info:hover,
    .option-set-button:hover {
        background-color: ${colors.grey200};
        border-radius: 0px;
    }

    .highlighted .edit:hover,
    .highlighted .info:hover,
    .highlighted .info.active,
    .highlighted .option-set-button:hover {
        background-color: ${theme.secondary900};
    }
`
