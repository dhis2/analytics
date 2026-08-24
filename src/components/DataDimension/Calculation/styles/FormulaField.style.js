import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-field {
        border-top: 1px solid ${colors.grey400};
        height: 180px;
        overflow: auto;
        padding: 6px 12px;
        position: relative;
        display: flex;
        align-items: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        gap: ${spacers.dp4} ${spacers.dp8};
        width: 100%;
    }

    .placeholder {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: ${spacers.dp8};
        align-items: center;
        justify-content: center;
        margin-top: -28px;
        padding: 0 ${spacers.dp32};
        text-align: center;
    }

    .help-text {
        color: ${colors.grey600};
        font-size: 14px;
        line-height: 19px;
        text-align: center;
        user-select: none;
    }
`
