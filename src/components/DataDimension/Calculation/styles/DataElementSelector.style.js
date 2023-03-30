import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .dimension-list-container {
        position: relative;
    }

    .dimension-list-scrollbox {
        position: relative;
        width: 100%;
        height: 337px;
        overflow: hidden;
        overflow-y: auto;
        border: 1px solid ${colors.grey400};
    }

    .dimension-list-scroller {
        position: relative;
        min-height: 1px;
        padding: 0 ${spacers.dp4};
    }

    .dimension-list-scroller.loading {
        filter: blur(2px);
    }

    .scroll-detector {
        boxsizing: border-box;
        width: 100%;
        height: 100px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: -1;
    }

    .dimension-list-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .filter-wrapper {
        padding: ${spacers.dp8};
        border: 1px solid ${colors.grey400};
        border-bottom: 0;
    }

    .selector-wrapper {
        display: flex;
        gap: ${spacers.dp4};
    }

    .sub-header {
        font-size: 14px;
        font-weight: normal;
        margin: 0 0 ${spacers.dp4};
    }

    .group-select {
        width: 50%;
        margin-top: ${spacers.dp4};
    }

    .empty-list {
        text-align: center;
        font-size: 14px;
        line-height: 16px;
        margin: ${spacers.dp24} 0 0;
        color: ${colors.grey700};
    }
`
