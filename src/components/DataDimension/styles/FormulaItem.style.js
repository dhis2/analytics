import { colors, spacers, elevations, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-item {
        position: relative;
        display: flex;
        width: fit-content;
        background: ${colors.grey200};
        font-size: 14px;
        height: 24px;
        border-radius: 3px;
        user-select: none;
        box-shadow: ${elevations.e100};
    }

    .content {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        width: fit-content;
        align-items: center;
        padding: 2px;
    }

    .input-positioner {
        position: relative;
        line-height: 18px;
        margin-right: 1px;
    }

    input {
        position: absolute;
        width: 100%;
        left: 0;
        background-color: transparent;
        border: 1px dashed #a0adba;
        padding: 0 0 0 2px;
    }

    input:hover,
    input:focus {
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .width-machine {
        /* Add extra space for number spinner */
        padding: 0 24px 0 0;
        visibility: hidden;
    }

    .icon {
        margin-right: ${spacers.dp4};
        display: inline-flex;
        vertical-align: text-bottom;
    }

    .operator-label {
        padding: 0 6px;
    }

    .data-element-label {
        padding: 0 4px;
        max-width: 280px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    /* highlighted items */

    .highlighted {
        background: ${theme.secondary800};
    }

    .highlighted input {
        color: ${colors.white};
    }

    .highlighted input:hover,
    .highlighted input:active {
        color: ${colors.grey900};
    }

    .highlighted :global(.icon path) {
        fill: ${colors.white};
    }

    /* DND markers */

    .inactive.insertBefore .content::before,
    .inactive.insertAfter .content::before,
    .inactive.insertBefore .content::after,
    .inactive.insertAfter .content::after {
        content: '';
        position: absolute;
        z-index: 100;
    }

    /* the vertical line */
    .content::before {
        top: 6px;
        bottom: 0;
        width: 4px;
        background-color: #4c9ffe;
    }

    /* the circle */
    .content::after {
        top: -4px;
        width: 12px;
        height: 12px;
        border: 4px solid #4c9ffe;
        background: transparent;
        border-radius: 12px;
    }

    .last-item {
        flex: 1;
    }

    .insertBefore .content::before {
        left: -6px;
    }
    .insertBefore .content::after {
        left: -10px;
    }

    .insertAfter .content::before {
        right: -6px;
    }
    .insertAfter .content::after {
        right: -10px;
    }
`
