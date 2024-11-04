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
        margin: 0;
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
        //padding-top: 1px;
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
    .info {
        height: 16px;
        margin-top: 1px;
        margin-left: ${spacers.dp8};
        cursor: pointer;
        color: ${colors.grey600};
    }

    .info {
        margin: 0 0 0 ${spacers.dp4};
        height: 100%;
        padding: 0 6px;
        display: flex;
        align-items: center;
    }

    .highlighted {
        background: ${theme.secondary700};
    }
    .highlighted:hover {
        background: ${theme.secondary800};
    }

    .highlighted .label {
        color: ${colors.white};
    }

    .highlighted .type {
        color: ${theme.secondary050};
    }

    .highlighted .info {
        color: ${theme.secondary050};
    }

    .highlighted :global(.icon path) {
        fill: ${colors.teal050};
    }

    .highlighted .type {
        color: ${colors.teal050};
    }

    .edit:hover,
    .info:hover {
        background-color: ${colors.grey200};
        // outline: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 0px;
    }

    .highlighted .edit:hover,
    .highlighted .info:hover {
        background-color: ${theme.secondary900};
        // outline: 1px solid rgba(255, 255, 255, 0.12);
    }
`
