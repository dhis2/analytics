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

    .formula-box {
        position: relative;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-top: 1px solid ${colors.grey400};
    }

    .formula-box.valid {
        border-top-color: transparent;
        box-shadow: inset 0 0 0 1px ${colors.green500};
    }

    .formula-box.invalid {
        border-top-color: transparent;
        box-shadow: inset 0 0 0 1px ${colors.red500};
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
        box-sizing: border-box;
        flex-shrink: 0;
    }

    .sub-header {
        font-size: 14px;
        font-weight: normal;
        margin: 0;
        flex-shrink: 0;
    }

    /* Clear chips under the overlay bar when validation is shown */
    .formula-box.valid :global(.formula-field),
    .formula-box.invalid :global(.formula-field) {
        padding-bottom: 40px;
    }

    .validation-bar {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: ${spacers.dp4};
        padding: ${spacers.dp8} ${spacers.dp12};
        box-sizing: border-box;
        background: ${colors.red050};
        outline: 1px solid ${colors.red500};
        outline-offset: -1px;
    }

    .formula-box.valid .validation-bar {
        background: ${colors.green050};
        outline-color: ${colors.green500};
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
        min-width: 0;
    }

    .valid .status-text {
        color: ${colors.green700};
    }

    .name-field {
        margin-bottom: ${spacers.dp16};
    }
`
