import { spacers, colors } from '@dhis2/ui'
import css from 'styled-jsx/css'

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
        padding: ${spacers.dp12} ${spacers.dp4};
    }
    .info-container {
        display: flex;
        margin-bottom: ${spacers.dp8};
        padding: ${spacers.dp8};
        background-color: ${colors.grey200};
        border-radius: 3px;
    }
    .info-text {
        padding-left: ${spacers.dp8};
        color: ${colors.grey900};
        font-size: 12px;
        line-height: 16px;
    }
`
