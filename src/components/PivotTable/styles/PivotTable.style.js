import { colors } from '@dhis2/ui'
import css from 'styled-jsx/css'
import {
    BORDER_COLOR,
    DISPLAY_DENSITY_PADDING_COMPACT,
    DISPLAY_DENSITY_PADDING_NORMAL,
    DISPLAY_DENSITY_PADDING_COMFORTABLE,
    FONT_SIZE_SMALL,
    FONT_SIZE_NORMAL,
    FONT_SIZE_LARGE,
} from '../../../modules/pivotTable/pivotTableConstants.js'

export const table = css.global`
    div.pivot-table-container {
        font-family: 'Roboto', Arial, sans-serif;
        overflow: auto;
        color: ${colors.grey900};
    }

    table {
        border-spacing: 0;
        white-space: nowrap;
        box-sizing: border-box;
        text-align: center;
        border: 1px solid ${BORDER_COLOR};
        border-width: 1px 1px 0 0;
    }

    table.fixed-headers {
        border-width: 0 0 0 1px;
    }

    table.fixed-headers tr th,
    table.fixed-headers tr td {
        border-width: 0 1px 1px 0;
    }

    table.fixed-column-headers {
        border-width: 0 1px 0 0;
    }

    table.fixed-column-headers tr th,
    table.fixed-column-headers tr td {
        border-width: 0 0 1px 1px;
    }

    table.fixed-headers thead tr:first-of-type th,
    table.fixed-column-headers thead tr:first-of-type th {
        border-top: 1px solid ${BORDER_COLOR};
    }

    table.fixed-row-headers {
        border-width: 0 0 1px 1px;
    }

    table.fixed-row-headers tr th,
    table.fixed-row-headers tr td {
        border-width: 1px 1px 0 0;
    }
`
export const cell = css`
    td,
    th {
        box-sizing: border-box;
        font-weight: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        border: 1px solid ${BORDER_COLOR};
        border-width: 0 0 1px 1px;
        cursor: default;
    }

    th.fixed-header {
        position: sticky;
        z-index: 1;
        top: 0;
        left: 0;
    }

    .fontsize-SMALL {
        font-size: ${FONT_SIZE_SMALL}px;
        line-height: ${FONT_SIZE_SMALL}px;
    }
    .fontsize-NORMAL {
        font-size: ${FONT_SIZE_NORMAL}px;
        line-height: ${FONT_SIZE_NORMAL}px;
    }
    .fontsize-LARGE {
        font-size: ${FONT_SIZE_LARGE}px;
        line-height: ${FONT_SIZE_LARGE}px;
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
    .title-cell {
        font-weight: bold;
        background-color: #cddaed;
        padding: 0;
    }
    .title-cell-content {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .title-cell.displaydensity-COMPACT > .title-cell-content {
        padding: ${DISPLAY_DENSITY_PADDING_COMPACT}px;
    }
    .title-cell.displaydensity-NORMAL > .title-cell-content {
        padding: ${DISPLAY_DENSITY_PADDING_NORMAL}px;
    }
    .title-cell.displaydensity-COMFORTABLE > .title-cell-content {
        padding: ${DISPLAY_DENSITY_PADDING_COMFORTABLE}px;
    }
    .row-header {
        background-color: #dae6f8;
    }
    .row-header-hierarchy {
        text-align: left;
    }
    .empty-header {
        background-color: #cddaed;
    }
    .total-header {
        background-color: #bac6d8;
    }
    .value {
        background-color: #ffffff;
    }
    .TEXT {
        text-align: left;
    }
    .NUMBER {
        text-align: right;
    }
    .clickable {
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
