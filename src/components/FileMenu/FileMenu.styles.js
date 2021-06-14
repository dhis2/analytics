import { colors } from '@dhis2/ui-constants'
import css from 'styled-jsx/css'

export const fileMenuStyles = css`
    .menu-toggle {
        display: inline-flex;
        position: relative;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 400;
        text-transform: none;
        padding: 6px 8px;
        color: ${colors.grey900};
        min-width: 64px;
        box-sizing: border-box;
        line-height: 1.75;
        background: none;
        border: none;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        cursor: pointer;
    }

    .menu-toggle:hover:enabled {
        background-color: ${colors.grey300};
        opacity: 0.8;
    }

    .menu-toggle:disabled {
        color: ${colors.grey400};
    }
    .menu-toggle:focus {
        outline: none;
    }
`
