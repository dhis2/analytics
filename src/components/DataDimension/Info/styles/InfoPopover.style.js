import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .popover {
        width: 480px;
        height: 360px;
        border: 1px solid ${colors.grey400};
        overflow-x: hidden;
        overflow-y: auto;
    }
    .loader {
        height: 100%;
        width: 100%;
    }
    .error {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: ${colors.grey700};
    }
    .data-table {
        display: table;
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        line-height: 17px;
        margin: ${spacers.dp4} 0 0 0;
        color: ${colors.grey900};
    }
    .data-table th {
        text-align: left;
        font-weight: 500;
        padding: 8px 0 8px 12px;
        width: 128px;
        vertical-align: top;
    }
    .data-table td {
        padding: 8px 4px 8px 16px;
        vertical-align: top;
    }
    .data-table .content-wrap {
        max-height: 240px;
        overflow-y: auto;
    }
    .data-table tr:hover {
        background: ${colors.grey100};
    }

    ul {
        margin: 0;
        padding: 0 0 0 ${spacers.dp16};
        list-style-position: outside;
    }
    li + li {
        margin: ${spacers.dp4} 0 0 0;
    }

    details ul {
        margin: ${spacers.dp4} 0 0 ${spacers.dp16};
    }

    .data-table .code {
        font-size: 11px;
        line-height: 15px;
        display: inline-block;
        border-radius: 2px;
        background-color: ${colors.grey200};
        // Use outline to give illusion of padding while keeping text aligned vertically with other values
        outline: 3px solid ${colors.grey200};
        color: ${colors.grey900};
        font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo,
            Consolas, 'DejaVu Sans Mono', monospace;
        font-weight: normal;
    }

    .data-table .none,
    .data-table .label {
        color: ${colors.grey600};
    }
`
