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
    .data-table {
        display: table;
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
        margin: ${spacers.dp4} 0 0 0;
        color: ${colors.grey900};
    }
    .data-table th {
        text-align: left;
        font-weight: 500;
        padding: 6px 0 0 12px;
        width: 128px;
        vertical-align: baseline;
    }
    .data-table td {
        padding: 6px 4px 6px 8px;
    }
    .data-table .code {
        font-family: monospace;
    }
    .data-table tr:hover {
        background: ${colors.grey100};
    }
`
