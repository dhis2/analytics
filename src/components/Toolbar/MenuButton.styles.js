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
        cursor: pointer;
    }

    button:hover:enabled,
    button:active:enabled {
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
