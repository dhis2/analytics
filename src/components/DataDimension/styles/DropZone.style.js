// import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .first-dropzone {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 24px;
        height: 28px;
        margin: var(--spacers-dp4);
        background-color: transparent;
    }

    .over {
        z-index: 100;
    }

    .empty {
        position: relative;
        flex-grow: 1;
        z-index: 100;
        margin-left: -10px;
        margin-top: -4px;
    }

    .over::before,
    .over::after {
        content: '';
        position: absolute;
    }

    /* the vertical line */
    .over::before {
        top: 10px;
        width: 4px;
        left: 4px;
        height: 18px;
        background-color: #4c9ffe;
    }

    /* the circle */
    .over::after {
        top: 0;
        left: 0;
        width: 12px;
        height: 12px;
        border: 4px solid #4c9ffe;
        background: transparent;
        border-radius: 12px;
    }
`
