import { colors } from '../../../../modules/colors'
import css from 'styled-jsx/css'

export default css`
    .highlighted-text {
        color: ${colors.white};
    }

    .icon {
        background-color: ${colors.accentSecondary};
    }

    .item {
        align-items: center;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        padding: 3px;
    }

    .ghost {
        opacity: 0.2;
        transition: opacity 0.2s ease;
    }

    .selected-item {
        background-color: #b2dfdb;
    }

    .selected-item:hover {
        background-color: #86c4bf;
    }

    .highlighted-item {
        background-color: ${colors.accentSecondaryDark};
    }

    .inactive-item {
        opacity: 0.3;
    }

    .item-label {
        font-size: 14px;
        padding: 2px;
    }
`
