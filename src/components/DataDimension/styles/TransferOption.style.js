import { colors, spacers, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper:last-child {
        margin-bottom: ${spacers.dp4};
    }
    .item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
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
        margin: 5px 4px;
    }

    .typeGroup {
        display: inline-flex;
        margin: 0;
        align-self: stretch;
        align-items: flex-start;
    }

    .nowrap {
        flex-shrink: 0;
    }

    .icon,
    .label {
        line-height: 16px;
        margin: 2px 0;
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
        margin: 9px 0 0 0;
    }

    .edit,
    .option-set-button {
        display: flex;
        align-items: center;
        margin-left: ${spacers.dp8};
        cursor: pointer;
        color: ${colors.grey600};
        background-color: ${colors.white};
        border: 1px solid ${colors.grey300};
        border-radius: 3px;
        padding: 0 2px;
        height: 20px;
    }

    .option-set-button:hover,
    .edit:hover {
        background-color: ${colors.grey050};
        border-color: #c7cbd0;
        color: ${colors.grey900};
    }

    .info {
        margin: 0 0 0 2px;
        padding: ${spacers.dp8} ${spacers.dp4} 0  ${spacers.dp4};};
        align-self: stretch;
        display: flex;
        align-items: flex-start;
        cursor: pointer;
        color: ${colors.grey600};
    }
    .info.active {
        background-color: ${colors.grey300};
        color: ${colors.grey900};
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

    .highlighted .icon,
    .highlighted .option-set-button,
    .highlighted .type,
    .highlighted .info {
        color: ${theme.secondary050};
    }

    .info:hover {
        background-color: ${colors.grey200};
        border-radius: 0px;
    }

    .highlighted .option-set-button,
    .highlighted .edit {
        background-color: transparent;
        border-color: ${theme.secondary900};
    }

    .highlighted .edit:hover,
    .highlighted .info:hover,
    .highlighted .info.active,
    .highlighted .option-set-button:hover {
        background-color: ${theme.secondary900};
    }
`
