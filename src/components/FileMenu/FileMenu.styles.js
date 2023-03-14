import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export const fileMenuStyles = css`
    .menu-toggle {
        display: inline-flex;
        position: relative;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 400;
        text-transform: none;
        padding: 6px ${spacers.dp12};
        border-radius: 3px;
        color: ${colors.grey900};
        box-sizing: border-box;
        line-height: 1.75;
        background: none;
        border: none;
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        cursor: pointer;
    }

    .menu-toggle:hover:enabled {
        background-color: ${colors.grey200};
    }

    .menu-toggle:disabled {
        color: ${colors.grey400};
        cursor: not-allowed;
    }

    .menu-toggle:active {
        background-color: ${colors.grey300};
    }

    .menuButton:focus {
        outline: 2px solid ${colors.blue600};
    }

    .menuButton:focus:not(:focus-visible) {
        outline: none;
    }
`

export const modalStyles = css`
    .modal-content {
        display: flex;
        flex-direction: column;
        gap: ${spacers.dp12};
    }
`
