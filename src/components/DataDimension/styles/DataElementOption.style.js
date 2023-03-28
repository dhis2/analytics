import { spacers, colors } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .wrapper {
        margin-top: ${spacers.dp4};
    }

    .wrapper:last-child {
        margin-bottom: ${spacers.dp4};
    }
    .draggable-item {
        cursor: pointer;
        display: inline-flex;
    }

    .chip {
        display: inline-flex;
        background: pink;
        font-size: 14px;
        padding: 2px ${spacers.dp8} 2px 2px;
        border-radius: 3px;
        user-select: none;
    }

    .chip:hover {
        background: ${colors.grey300};
    }

    .icon,
    .label {
        line-height: 18px;
    }

    .icon {
        margin-right: 2px;
        display: inline-flex;
        vertical-align: text-bottom;
        padding-top: 1px;
    }
`
