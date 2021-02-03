import css from 'styled-jsx/css'
import { spacers, colors } from '@dhis2/ui'

export default css`
    .filterContainer {
        display: flex;
        margin-bottom: ${spacers.dp12};
        margin-top: ${spacers.dp8};
    }
    .emptyList {
        text-align: center;
        font-size: 14px;
        line-height: 16px;
        margin: ${spacers.dp24} 0 0;
        color: ${colors.grey700};
    }
    .rightHeader {
        font-size: 14px;
        font-weight: 400;
    }
    .leftHeader {
        padding: ${spacers.dp8} 0;
    }
`
