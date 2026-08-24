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

    .sub-header-row {
        display: flex;
        align-items: center;
        margin: ${spacers.dp4} ${spacers.dp8};
    }

    .sub-header {
        font-size: 14px;
        font-weight: normal;
        margin: 0;
    }

    .name-field {
        margin-bottom: ${spacers.dp16};
    }

    .hint {
        position: relative;
        display: inline-flex;
    }

    .hint-trigger {
        display: inline-flex;
        align-items: center;
        padding: ${spacers.dp4} ${spacers.dp4} ${spacers.dp4} 4px;
        background: none;
        border: none;
        color: ${colors.grey600};
        cursor: default;
    }

    .shortcuts {
        background: ${colors.white};
        border-radius: 4px;
        box-shadow: ${elevations.popover};
        padding: ${spacers.dp12} ${spacers.dp16};
        max-width: 364px;
        color: ${colors.grey900};
        font-size: 14px;
    }

    .shortcuts-header {
        margin: ${spacers.dp12} 0 ${spacers.dp8};
        text-transform: uppercase;
        font-size: 11px;
        font-weight: 400;
        letter-spacing: 0.3px;
        color: ${colors.grey600};
    }

    .shortcuts-header:first-child {
        margin-top: 0;
    }

    .shortcuts ul {
        margin: 0;
        padding-left: ${spacers.dp16};
    }

    .shortcuts li {
        margin: 0 0 ${spacers.dp8};
        line-height: 1.5;
    }

    .shortcuts li:last-child {
        margin-bottom: 0;
    }

    .shortcut-keys {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: ${spacers.dp4};
        vertical-align: middle;
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
