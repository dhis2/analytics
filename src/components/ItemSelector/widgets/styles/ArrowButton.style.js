import { colors } from '../../styles/colors'
import css from 'styled-jsx/css'

export default css`
    .arrow-button {
        background-color: transparent;
        border: 1px solid #d5dde5;
        border-radius: 4px;
        height: 36px;
        min-height: 36px;
        min-width: 40px;
        padding: 0px;
        width: 40px;
    }

    .arrow-button:focus {
        outline: none;
    }

    .arrow-button:active:focus {
        background-color: rgba(158,158,158,0.18);
    }
    
    .arrow-button:hover {
        cursor: pointer;
        background-color: rgba(158, 158, 158, 0.07);
    }

    .arrow-icon {
        fill: ${colors.greyDark},
        height: 20px;
        width: 24px;
    }
`
