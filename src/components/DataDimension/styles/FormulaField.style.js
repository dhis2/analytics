import { colors, spacers, elevations, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper {
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        gap: ${spacers.dp4} ${spacers.dp8};
        height: 120px;
        border: 2px solid ${colors.grey200};
        padding: ${spacers.dp4};
    }

    .operators {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacers.dp4};
        padding: ${spacers.dp4};
        border-top: 1px solid ${colors.grey400};
    }

    .operator {
        display: inline-block;
        background: ${colors.grey200};
        padding: ${spacers.dp4} ${spacers.dp8};
        border-radius: 3px;
        font-size: 14px;
        line-height: 16px;
    }

    .part {
        display: inline-block;
        height: 21px;
        background: ${colors.grey200};
        font-size: 14px;
        line-height: 16px;
        padding: 2px ${spacers.dp4};
        margin: ${spacers.dp4} 0 0 0;
        border-radius: 3px;
        user-select: none;
        box-shadow: ${elevations.e100};
    }

    .dimension {
        padding: 2px ${spacers.dp8} 2px ${spacers.dp4};
    }

    .icon {
        margin-right: ${spacers.dp4};
        display: inline-flex;
        vertical-align: text-bottom;
        padding-top: 1px;
    }
`
