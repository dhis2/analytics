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

    .content {
        display: flex;
        gap: ${spacers.dp16};
    }

    .left-section {
        flex-basis: 70%;
    }

    .right-section {
        font-size: 14px;
        line-height: 24px;
    }
`
