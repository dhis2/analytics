import { colors, spacers, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-item {
        position: relative;
        display: flex;
        align-items: center;
        width: fit-content;
    }

    .formula-item:not(.inactive) {
        opacity: 0.5;
    }

    .content {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        user-select: none;
        height: 24px;
        font-size: 14px;
        border-radius: 3px;
        background: ${colors.grey200};
    }

    .icon {
        display: inline-flex;
        margin-right: 2px;
    }

    .operator {
        padding: 0;
        width: 24px;
    }

    .data {
        padding: 0 ${spacers.dp4} 0 2px;
    }

    .operator .label {
        margin-bottom: 1px;
    }

    .data .label {
        max-width: 280px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    /* number input */

    .number-positioner {
        position: relative;
        line-height: 18px;
        margin-right: 2px;
    }

    .number-width {
        /* Add extra space for number spinner */
        padding: 0 24px 0 0;
        visibility: hidden;
    }

    .input {
        position: absolute;
        width: 100%;
        left: 0;
        background-color: transparent;
        border: 1px dashed #a0adba;
        padding: 0 0 0 2px;
    }

    .input:hover,
    .input:focus {
        background: white;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    /* highlighted items */

    .highlighted {
        background: ${theme.secondary800};
        color: ${colors.white};
    }

    .highlighted .input {
        color: ${colors.white};
    }

    .highlighted .input:hover,
    .highlighted .input:active,
    .highlighted .input:focus {
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
        background-color: ${colors.blue500};
    }

    /* the circle */
    .content::after {
        top: -4px;
        width: 12px;
        height: 12px;
        border: 4px solid ${colors.blue500};
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
