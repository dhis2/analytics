import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-section {
        /* Match left column height; FormulaField scrolls inside. */
        position: absolute;
        inset: 0;
        background: ${colors.white};
        border: 1px solid ${colors.grey400};
        display: flex;
        flex-direction: column;
        overflow: hidden;
        min-height: 0;
    }

    .formula-section.valid {
        border-color: ${colors.green500};
    }

    .formula-section.invalid {
        border-color: ${colors.red500};
    }

    .delete-button {
        margin-right: ${spacers.dp8};
    }

    .content {
        display: flex;
        gap: ${spacers.dp12};
        align-items: stretch;
    }

    .left-section {
        width: 40%;
        flex-shrink: 0;
    }

    .right-section {
        width: 60%;
        font-size: 14px;
        position: relative;
        min-height: 0;
    }

    .sub-header-row {
        display: flex;
        align-items: center;
        gap: ${spacers.dp8};
        padding: ${spacers.dp8} ${spacers.dp8} 0;
        /* Reserve space for status text so the row doesn't jump when it appears */
        min-height: calc(${spacers.dp8} + 19px);
        box-sizing: border-box;
        flex-shrink: 0;
    }

    .sub-header {
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        flex-shrink: 0;
    }

    .validation-status {
        margin-left: auto;
        min-width: 0;
        display: flex;
        justify-content: flex-end;
    }

    .status {
        display: inline-flex;
        align-items: center;
        gap: ${spacers.dp4};
        min-width: 0;
    }

    .status-text {
        color: ${colors.red700};
        font-size: 14px;
        line-height: 19px;
    }

    .valid .status-text {
        color: ${colors.green700};
    }

    .name-field {
        margin-bottom: ${spacers.dp16};
    }
`
