import { colors } from './colors'
import css from 'styled-jsx/css'

export default css`
    .item-selector-container {
        box-sizing: border-box;
        display: flex;
        flex: 1 1 auto;
        font-family: Roboto, sans-serif;
    }

    .section {
        border: 1px solid ${colors.greyLight};
        display: flex;
        flex-direction: column;
        height: 510px;
        position: relative;
    }

    .unselected {
        margin-right: 55px;
        width: 418px;
    }

    .selected {
        width: 276px;
    }
`
