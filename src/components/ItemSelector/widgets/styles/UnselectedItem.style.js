import { colors, theme } from '@dhis2/ui-core'
import css from 'styled-jsx/css'

export default css`
    .highlighted-text {
        color: ${colors.white};
    }

    .item {
        align-items: center;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        padding: 3px;
    }

    .unselected-item:hover {
        background-color: #e0e0e0;
    }

    .highlighted-item {
        background-color: ${theme.secondary800};
    }

    .item-label {
        font-size: 14px;
        padding: 2px 5px 2px 2px;
    }
`
