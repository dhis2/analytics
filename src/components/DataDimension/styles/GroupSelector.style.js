import { spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .container {
        display: flex;
        min-height: 53px;
        padding-left: ${spacers.dp16};
        margin-top: ${spacers.dp12};
    }
    .group-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }
`
