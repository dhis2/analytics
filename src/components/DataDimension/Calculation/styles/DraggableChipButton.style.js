import { theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .draggable-item {
        all: unset;
        display: inline-flex;
        cursor: pointer;
        border-radius: 3px;
    }

    .draggable-item:focus {
        outline: 2px solid ${theme.focus};
        outline-offset: -2px;
    }

    /* Prevent focus styles when mouse clicking */
    .draggable-item:focus:not(:focus-visible) {
        outline: none;
    }
`
