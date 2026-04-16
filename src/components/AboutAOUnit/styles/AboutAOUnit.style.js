import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .container {
        position: relative;
        padding: ${spacers.dp16};
        border-bottom: 1px solid ${colors.grey400};
        background-color: ${colors.white};
    }

    .expanded {
        padding-bottom: ${spacers.dp16};
    }

    .loader {
        display: flex;
        justify-content: center;
        padding-top: ${spacers.dp16};
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }

    .title {
        font-size: 16px;
        font-weight: 500;
        line-height: 21px;
        color: ${colors.grey900};
    }

    .content {
        font-size: 14px;
        line-height: 20px;
        color: ${colors.grey900};
    }

    .detailLine {
        display: flex;
        align-items: flex-start;
        margin: 0;
        padding: ${spacers.dp12} 0 0 0;
        gap: ${spacers.dp8};
    }

    .detailLine .icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        height: 20px;
    }

    .description {
        padding: 0;
    }

    .description :global(p) {
        margin: ${spacers.dp8} 0 ${spacers.dp4} 0;
        white-space: pre-line;
    }

    .noDescription {
        color: ${colors.grey500};
    }

    .subsection {
        margin-top: ${spacers.dp24};
    }

    .subsectionTitle {
        color: ${colors.grey800};
        font-weight: 500;
        margin: 0;
    }

    .subscriptionLabel {
        font-size: 13px;
        line-height: 18px;
        margin: ${spacers.dp4} 0 ${spacers.dp8} 0;
        color: ${colors.grey600};
    }
`
