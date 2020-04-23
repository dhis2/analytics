import { colors } from '@dhis2/ui-core'
import css from 'styled-jsx/css'

export default css`
    .item-selector-container {
        box-sizing: border-box;
        display: flex;
        flex: 1 1 auto;
        font-family: Roboto, sans-serif;
    }
    .section {
        border: 1px solid ${colors.grey300};
        display: flex;
        flex-direction: column;
        height: 480px;
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
