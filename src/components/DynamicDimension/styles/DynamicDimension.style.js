import { spacers, colors } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .automatic {
        margin-bottom: ${spacers.dp12};
    }
    .manual {
        margin-bottom: ${spacers.dp8};
    }
    .help-text {
        font-size: 14px;
        padding-left: 23px;
        color: ${colors.grey700};
        margin: 0;
    }
`
