import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .scroll-container {
        width: 350px;
        height: 300px;
        overflow: hidden;
        overflow-y: auto;
    }

    .content-container {
        position: relative;
        min-height: 1px;
    }

    .container {
        boxsizing: border-box;
        ${
            '' /* FIXME: the colored border and background are just for testing! Remove before merge  */
        }
        border: 1px solid #f76a8c;
        background: rgba(246, 172, 200, 0.4);
        width: 100%;
        height: 100px;
        position: absolute;
        bottom: 0;
        left: 0;
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
