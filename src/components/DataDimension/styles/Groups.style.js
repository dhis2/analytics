import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui'

export default css`
    .container {
        border: 1px solid ${colors.grey300};
        display: flex;
        min-height: 53px;
        border-right: 0;
        border-left: 0;
        padding: 5px 5px 10px 10px;
    }
    .group-container {
        display: flex;
        flex-direction: column;
        width: inherit;
        min-width: 290px;
        flex-grow: 1;
    }
`
