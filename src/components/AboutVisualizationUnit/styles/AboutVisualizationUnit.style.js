import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .container {
        padding: ${spacers.dp16};
        border-bottom: 1px solid ${colors.grey400};
        background-color: ${colors.white};
    }

    .expanded {
        padding-bottom: ${spacers.dp32};
    }

    .loader {
        display: flex;
        justify-content: center;
    }

    .header {
        display: flex;
        justify-content: space-between;
        font-size: ${spacers.dp16};
        font-weight: 500;
        line-height: 21px;
        color: ${colors.grey900};
    }

    .content {
        font-size: 14px;
        line-height: 18px;
        color: ${colors.grey900};
    }

    .detailLine {
        display: flex;
        margin: 0;
        padding: ${spacers.dp12} 0 0 0;
        gap: ${spacers.dp8};
    }

    .detailLine svg {
        flex-shrink: 0;
    }

    .noDescription {
        color: ${colors.grey600};
    }

    .subsection {
        margin-top: ${spacers.dp24};
    }

    .subsectionTitle {
        color: ${colors.grey700};
        font-weight: 500;
    }

    .subscriptionLabel {
        margin: ${spacers.dp12} 0 ${spacers.dp8} 0;
    }

    .subsection button {
        margin-top: ${spacers.dp8};
    }
`
