import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export const styles = css`
    .data-table-wrapper {
        min-height: 405px;
    }

    .data-table-body {
        min-height: 465px;
    }

    .pagination-controls {
        width: 100%;
        margin-top: ${spacers.dp12};
        display: flex;
        justify-content: flex-end;
    }

    .search-and-filter-bar {
        display: flex;
        gap: ${spacers.dp4};
        align-items: center;
        margin-bottom: ${spacers.dp8};
    }

    .search-field-container {
        min-width: 220px;
    }

    .type-field-container,
    .created-by-field-container {
        min-width: 180px;
    }

    .info-cell {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${spacers.dp8};
        margin: ${spacers.dp32} 0;
    }

    .info-container {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .info-text {
        text-align: center;
        font-size: 14px;
        line-height: 19px;
        color: ${colors.grey700};
    }

    .info-button {
        margin-top: ${spacers.dp12};
    }
`
