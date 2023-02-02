// import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .firstDropZone {
        position: absolute;
        top: 0;
        left: 4px;
        z-index: -1;
        width: 32px;
        height: 26px;
        margin: var(--spacers-dp4);
        background-color: transparent;
    }

    .isOver {
        z-index: 100;
    }

    .isEmpty {
        position: relative;
        flex-grow: 1;
        z-index: 100;
    }

    .isOver::before,
    .isOver::after {
        content: '';
        position: absolute;
    }

    /* the vertical line */
    .isOver::before {
        top: 8px;
        width: 4px;
        left: -6px;
        height: 18px;
        background-color: #4c9ffe;
    }

    /* the circle */
    .isOver::after {
        top: -4px;
        left: -10px;
        width: 12px;
        height: 12px;
        border: 4px solid #4c9ffe;
        background: transparent;
        border-radius: 12px;
    }
`
