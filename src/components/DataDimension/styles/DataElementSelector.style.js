import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .dimension-list-container {
        position: relative;
    }

    .dimension-list-scrollbox {
        position: relative;
        width: 100%;
        height: 300px;
        overflow: hidden;
        overflow-y: auto;
        padding: ${spacers.dp4};
        border: 1px solid ${colors.grey400};
    }

    .dimension-list-scrollbox.loading {
        filter: blur(2px);
    }

    .dimension-list-scroller {
        position: relative;
        min-height: 1px;
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
        width: 100%;
        height: 100%;
    }

    .filter-wrapper {
        padding: ${spacers.dp8};
        border: 1px solid ${colors.grey400};
    }

    .sub-header {
        font-size: 14px;
        font-weight: normal;
        margin: 0 0 ${spacers.dp4};
    }

    .group-select {
        margin-top: ${spacers.dp4};
    }
`
