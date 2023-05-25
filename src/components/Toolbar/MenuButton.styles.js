import { colors, spacers, theme } from '@dhis2/ui-constants'
import css from 'styled-jsx/css'

export default css`
    button {
        all: unset;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        line-height: 14px;
        padding: 0 ${spacers.dp12};
        color: ${colors.grey900};
        transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        cursor: pointer;
    }

    button:hover:enabled,
    button:active {
        background-color: ${colors.grey200};
    }

    button:focus {
        outline: 3px solid ${theme.focus};
        outline-offset: -3px;
    }

    /* Prevent focus styles when mouse clicking */
    button:focus:not(:focus-visible) {
        outline: none;
    }

    button:disabled {
        color: ${colors.grey500};
        cursor: not-allowed;
    }
`
