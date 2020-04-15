import css from 'styled-jsx/css'
import { colors } from '../../../modules/colors'

export default css`
    .container {
        border: 1px solid ${colors.greyLight};
        display: flex;
        min-height: 53px;
        border-right: 0;
        border-left: 0;
        padding-top: 5px;
        padding-left: 10px;
    }
    .group-container {
        display: flex;
        flex-direction: column;
        width: inherit;
        min-width: 294px;
        flex-grow: 1;
        padding-right: 5px;
    }
`
