import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .header {
        background: ${colors.grey200};
        padding: ${spacers.dp16};
        font-weight: normal;
    }

    .header-icon {
        padding: 0 ${spacers.dp8};
        vertical-align: text-bottom;
        line-height: 14px;
    }

    .actions-wrapper {
        margin-top: ${spacers.dp16};
        margin-bottom: ${spacers.dp16};
    }

    .remove-button {
        display: inline-block;
        margin-left: ${spacers.dp8};
    }

    .delete-button {
        margin-top: ${spacers.dp8};
    }

    .content {
        display: flex;
        justify-content: space-between;
    }

    .left-section {
        width: 45%;
    }

    .right-section {
        width: 53%;
        font-size: 14px;
        line-height: 24px;
    }

    .leftpad {
        padding-left: ${spacers.dp4};
    }

    .validation-message {
        margin-left: ${spacers.dp8};
    }

    .validation-error {
        color: ${colors.red500};
    }

    .validation-success {
        color: ${colors.green500};
    }

    .name-input {
        margin-bottom: ${spacers.dp8};
        max-width: 75%;
    }

    .dragOverlay {
        padding: 4px;
    }
`