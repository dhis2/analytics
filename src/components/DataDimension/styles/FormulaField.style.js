import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-field {
        border-right: 2px solid ${colors.grey200};
        height: 200px;
        overflow: auto;
        padding: 4px 10px;
        position: relative;
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        gap: ${spacers.dp4} ${spacers.dp8};
        width: 100%;
    }

    .container {
        position: relative;
    }

    .border {
        position: absolute;
        top: 0;
        left: 4px;
        height: 200px;
        width: 99%;
        border-left: 2px solid ${colors.grey200};
        border-top: 2px solid ${colors.grey200};
        border-bottom: 2px solid ${colors.grey200};
    }
`
