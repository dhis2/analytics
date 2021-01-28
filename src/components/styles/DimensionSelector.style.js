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
        padding: 12px 4px;
    }
    .info-container {
        display: flex;
        margin-bottom: 8px;
        padding: 8px;
        background-color: ${colors.grey200};
        border-radius: 4px;
    }
    .info-text {
        padding-left: 6px;
        color: ${colors.grey900};
        font-size: 12px;
        line-height: 17px;
    }
`
