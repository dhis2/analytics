import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .scrollContainer {
        width: 350px;
        height: 300px;
        overflow: hidden;
        overflow-y: auto;
    }

    .contentContainer {
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

    .filterWrapper {
        padding: ${spacers.dp8};
        border: 1px solid ${colors.grey400};
    }
`
