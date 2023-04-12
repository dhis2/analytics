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
        margin-left: ${spacers.dp4};
    }

    .validate-button {
        margin-bottom: ${spacers.dp4};
        display: inline-block;
    }

    .remove-button {
        display: inline-block;
        margin-right: ${spacers.dp8};
    }

    .delete-button {
        margin-right: ${spacers.dp8};
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
        margin-top: ${spacers.dp12};
    }
`
