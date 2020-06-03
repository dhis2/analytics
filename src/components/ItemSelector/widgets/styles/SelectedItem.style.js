import { colors, theme } from '@dhis2/ui-constants'
import css from 'styled-jsx/css'

export default css`
    .highlighted-text {
        color: ${colors.white};
    }

    .icon {
        background-color: ${theme.secondary600};
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
        background-color: ${theme.secondary200};
    }

    .selected-item:hover {
        background-color: #86c4bf;
    }

    .highlighted-item {
        background-color: ${theme.secondary800};
    }

    .inactive-item {
        opacity: 0.3;
    }

    .item-label {
        font-size: 14px;
        padding: 2px;
    }
`
