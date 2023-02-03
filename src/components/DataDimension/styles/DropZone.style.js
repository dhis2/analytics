// import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .firstDropZone {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 24px;
        height: 28px;
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
        margin-left: -10px;
        margin-top: -4px;
    }

    .isOver::before,
    .isOver::after {
        content: '';
        position: absolute;
    }

    /* the vertical line */
    .isOver::before {
        top: 10px;
        width: 4px;
        left: 4px;
        height: 18px;
        background-color: #4c9ffe;
    }

    /* the circle */
    .isOver::after {
        top: 0;
        left: 0;
        width: 12px;
        height: 12px;
        border: 4px solid #4c9ffe;
        background: transparent;
        border-radius: 12px;
    }
`
