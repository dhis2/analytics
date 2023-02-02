import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .draggingItem {
        display: inline-block;
        background: ${colors.grey200};
        padding: ${spacers.dp4};
        border-radius: 3px;
        font-size: 14px;
        line-height: 16px;
        cursor: default;
        user-select: none;
    }

    .iconAndLabelWrapper {
        display: inline-flex;
        align-items: center;
    }

    .icon {
        flex: 0 0 auto;
        width: 16px;
        height: 16px;
        margin-right: 4px;
    }

    .label {
        flex: 0 1 auto;
    }
`
