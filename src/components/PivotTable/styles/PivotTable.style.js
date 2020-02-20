import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui-core'

export const table = css`
    div.pivot-table-container {
        overflow: auto;
        font-size: 10px;
        color: ${colors.grey900};
    }
    div.pivot-table-container::-webkit-scrollbar {
        -webkit-appearance: none;
    }

    div.pivot-table-container::-webkit-scrollbar-vertical {
        width: 8px;
    }

    div.pivot-table-container::-webkit-scrollbar-horizontal {
        height: 8px;
    }

    div.pivot-table-container::-webkit-scrollbar-thumb {
        border-radius: 8px;
        border: 1px solid white; /* should match background, can't be transparent */
        background-color: rgba(0, 0, 0, 0.5);
    }
    table {
        border-spacing: 0;
        border-collapse: collapse;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        box-sizing: border-box;
        text-align: center;
    }
`

export const cell = css`
    td,
    th {
        font-weight: normal;
        overflow: hidden;
        padding: 0px;
        border: 1px solid #b2b2b2;
        min-width: 150px;
        width: 150px;
        max-width: 150px;
        min-height: 25px;
        height: 25px;
        cursor: default;
    }
    .column-header {
        position: sticky;
        top: 0;
        z-index: 2;
        background-color: #dae6f8;
    }
    .title {
        font-weight: bold;
        background-color: #cddaed;
    }
    .row-header {
        position: sticky;
        left: 0;
        z-index: 1;
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
`
