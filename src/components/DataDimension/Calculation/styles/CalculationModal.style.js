import { colors, elevations, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-section {
        background: ${colors.white};
        border: 1px solid ${colors.grey400};
    }

    .validation-notice {
        margin-top: ${spacers.dp8};
    }

    .formula-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: ${spacers.dp8};
    }

    .delete-button {
        margin-right: ${spacers.dp8};
    }

    .content {
        display: flex;
        gap: ${spacers.dp12};
    }

    .left-section {
        width: 40%;
    }

    .right-section {
        width: 60%;
        font-size: 14px;
        display: flex;
        flex-direction: column;
    }

    .sub-header {
        font-size: 14px;
        font-weight: normal;
        margin: ${spacers.dp4} ${spacers.dp8};
    }

    .name-field {
        margin-bottom: ${spacers.dp16};
    }

    .usage-legend {
        display: flex;
        flex-direction: column;
        gap: ${spacers.dp4};
        padding-top: ${spacers.dp4};
    }

    .see-also {
        margin: 0;
        font-size: 12px;
        line-height: 14px;
        color: ${colors.grey700};
    }

    .hint {
        position: relative;
    }

    .hint-trigger {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        color: inherit;
        text-decoration: underline dotted;
        text-underline-offset: 2px;
        cursor: help;
        white-space: nowrap;
    }

    .shortcuts {
        background: ${colors.white};
        border-radius: 4px;
        box-shadow: ${elevations.popover};
        padding: ${spacers.dp12} ${spacers.dp16};
        max-width: 340px;
        color: ${colors.grey900};
        font-size: 14px;
    }

    .shortcuts ul {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: ${spacers.dp8};
    }

    .shortcuts li {
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: ${spacers.dp4};
    }

    .shortcut-keys {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacers.dp4};
    }

    .key {
        display: inline-block;
        min-width: 1.4em;
        padding: 1px 5px;
        border: 1px solid ${colors.grey400};
        border-radius: 3px;
        background: ${colors.grey050};
        box-shadow: 0 1px 0 ${colors.grey400};
        font-family: monospace;
        font-size: 12px;
        line-height: 1.4;
        text-align: center;
    }
`
