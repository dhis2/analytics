import { spacers, colors } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .container {
        position: absolute;
        top: 0;
        right: 0;
        width: 180px;
        background: ${colors.white};
        padding: ${spacers.dp8};
    }
    .legendSet {
        display: flex;
        flex-direction: column;
        margin-left: ${spacers.dp4};
        font-size: 13px;
    }
    .legend {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        padding: ${spacers.dp4} 0 ${spacers.dp4} ${spacers.dp4};
        white-space: break-spaces;
        text-align: left;
    }
`
