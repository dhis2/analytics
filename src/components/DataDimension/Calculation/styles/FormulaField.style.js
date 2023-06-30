import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .formula-field {
        border-right: 2px solid ${colors.grey200};
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

    .container {
        position: relative;
    }

    .border {
        position: absolute;
        top: 0;
        left: 6px;
        height: 180px;
        width: calc(100% - 6px);
        border-left: 2px solid ${colors.grey200};
        border-top: 2px solid ${colors.grey200};
        border-bottom: 2px solid ${colors.grey200};
    }

    .placeholder {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: ${spacers.dp8};
        align-items: center;
        justify-content: center;
        margin-top: -28px;
        padding: 0 ${spacers.dp32};
    }

    .help-text {
        color: ${colors.grey600};
        font-size: 14px;
        line-height: 19px;
        user-select: none;
    }
`
