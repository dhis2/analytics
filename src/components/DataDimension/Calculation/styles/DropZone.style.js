import { colors } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .first-dropzone {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 24px;
        height: 28px;
        background-color: transparent;
    }

    .dragging-over {
        z-index: 100;
    }

    .empty {
        position: relative;
        flex-grow: 1;
        z-index: 100;
        margin-left: -10px;
        margin-top: -4px;
    }

    .dragging-over::before,
    .dragging-over::after {
        content: '';
        position: absolute;
    }

    /* the vertical line */
    .dragging-over::before {
        top: 10px;
        width: 4px;
        left: 4px;
        height: 18px;
        background-color: ${colors.blue500};
    }

    /* the circle */
    .dragging-over::after {
        top: 0;
        left: 0;
        width: 12px;
        height: 12px;
        border: 4px solid ${colors.blue500};
        background: transparent;
        border-radius: 12px;
    }
`
