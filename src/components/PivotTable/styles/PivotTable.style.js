import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui-core'

export const table = css`
    div.pivot-table-container {
        font-family: 'Roboto', Arial, sans-serif;
        overflow: auto;
        color: ${colors.grey900};
    }
    table {
        border-spacing: 0;
        border-collapse: collapse;
        white-space: nowrap;
        overflow: hidden;
        box-sizing: border-box;
        text-align: center;
    }
`

export const cell = css`
    td,
    th {
        box-sizing: border-box;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        border: 1px solid #b2b2b2;
        min-width: 150px;
        width: 150px;
        max-width: 150px;
        min-height: 25px;
        height: 25px;
        cursor: default;
    }

    .fontsize-SMALL {
        font-size: 10px;
    }
    .fontsize-NORMAL {
        font-size: 11px;
    }
    .fontsize-LARGE {
        font-size: 13px;
    }

    .displaydensity-COMPACT {
        padding: 4px;
    }
    .displaydensity-NORMAL {
        padding: 5px;
    }
    .displaydensity-COMFORTABLE {
        padding: 7px;
    }

    .column-header {
        background-color: #dae6f8;
    }
    div.column-header-inner {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .title {
        font-weight: bold;
        background-color: #cddaed;
    }
    .row-header {
        background-color: #dae6f8;
    }
    .empty-header {
        background-color: #cddaed;
    }
    .total-header {
        background-color: #bac6d8;
    }
    .value {
        background-color: #ffffff;
        cursor: normal;
        text-align: left;
    }
    .value.NUMBER {
        text-align: center;
        cursor: pointer;
    }

    .value:hover {
        background-color: #f3f3f3;
    }

    .subtotal {
        background-color: #f4f4f4;
    }
    .total {
        background-color: #d8d8d8;
    }

    .column-header-label {
        overflow: hidden;
        text-overflow: ellipsis;
    }
`

export const sortIcon = css`
    .fontsize-SMALL {
        height: 10px;
        margin-bottom: 1px;
        margin-left: 5px;
    }

    .fontsize-NORMAL {
        height: 11px;
        max-height: 11px;
        margin-bottom: 2px;
        margin-left: 6px;
    }

    .fontsize-LARGE {
        height: 13px;
        margin-bottom: 2px;
        margin-left: 7px;
    }
`
