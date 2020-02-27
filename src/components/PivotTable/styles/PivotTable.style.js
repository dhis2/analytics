import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui-core'
import {
    DISPLAY_DENSITY_PADDING_COMPACT,
    DISPLAY_DENSITY_PADDING_NORMAL,
    DISPLAY_DENSITY_PADDING_COMFORTABLE,
    FONT_SIZE_SMALL,
    FONT_SIZE_NORMAL,
    FONT_SIZE_LARGE,
} from '../../../modules/pivotTable/pivotTableConstants'

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
        cursor: default;
    }

    .fontsize-SMALL {
        font-size: ${FONT_SIZE_SMALL}px;
    }
    .fontsize-NORMAL {
        font-size: ${FONT_SIZE_NORMAL}px;
    }
    .fontsize-LARGE {
        font-size: ${FONT_SIZE_LARGE}px;
    }

    .displaydensity-COMPACT {
        padding: ${DISPLAY_DENSITY_PADDING_COMPACT}px;
    }
    .displaydensity-NORMAL {
        padding: ${DISPLAY_DENSITY_PADDING_NORMAL}px;
    }
    .displaydensity-COMFORTABLE {
        padding: ${DISPLAY_DENSITY_PADDING_COMFORTABLE}px;
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
        height: ${FONT_SIZE_SMALL}px;
        margin-bottom: 1px;
        margin-left: 5px;
    }

    .fontsize-NORMAL {
        height: ${FONT_SIZE_NORMAL}px;
        max-height: 11px;
        margin-bottom: 2px;
        margin-left: 6px;
    }

    .fontsize-LARGE {
        height: ${FONT_SIZE_LARGE}px;
        margin-bottom: 2px;
        margin-left: 7px;
    }
`
