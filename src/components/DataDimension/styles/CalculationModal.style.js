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

    .check-button {
        margin-top: ${spacers.dp16};
        margin-bottom: ${spacers.dp16};
    }

    .remove-button {
    }

    .delete-button {
        margin-top: ${spacers.dp32};
    }

    .content {
        display: flex;
    }

    .left-section {
        width: 45%;
    }

    .right-section {
        width: 55%;
        padding-left: ${spacers.dp8};
        font-size: 14px;
        line-height: 24px;
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
`
