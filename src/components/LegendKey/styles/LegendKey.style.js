import { spacers, colors } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .container {
        width: 180px;
        background: ${colors.white};
        padding: ${spacers.dp8};
    }
    .legendSet {
        display: flex;
        flex-direction: column;
        margin-left: ${spacers.dp4};
    }
    .legendSetName {
        display: inline-block;
        font-size: 13px;
        color: ${colors.grey700};
        margin-bottom: 2px;
    }
    .legend {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        padding: ${spacers.dp4} 0 ${spacers.dp4} 6px;
        white-space: break-spaces;
        text-align: left;
        font-size: 13px;
    }
    .values {
        color: ${colors.grey600};
        font-size: 12px;
        padding-top: 2px;
    }
    .divider {
        border-top: 1px solid ${colors.grey400};
        padding-top: ${spacers.dp8};
        margin-top: ${spacers.dp8};
    }
`
