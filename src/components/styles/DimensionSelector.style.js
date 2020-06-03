import css from 'styled-jsx/css'
import { spacers, colors } from '@dhis2/ui-constants'

export default css`
    .filterContainer {
        display: flex;
        margin-bottom: ${spacers.dp12};
        margin-top: ${spacers.dp8};
    }
    .emptySelection {
        text-align: center;
        font-size: 14px;
        line-height: 16px;
        margin: ${spacers.dp24} 0 0;
        color: ${colors.grey700};
    }
`
