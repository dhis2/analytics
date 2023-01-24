import { colors, spacers, elevations, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
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

    .highlighted {
        background: ${theme.secondary800};
        color: ${colors.white};
    }

    .highlighted :global(.icon path) {
        fill: ${colors.white};
    }

    .isLast {
        flex: 1;
    }

    .isOver {
        z-index: 100;
    }

    .isEmpty {
        position: relative;
        flex-grow: 1;
        z-index: 100;
    }

    .isOver::before,
    .isOver::after {
        content: '';
        position: absolute;
    }

    /* the vertical line */
    .isOver::before {
        top: 8px;
        width: 4px;
        left: -6px;
        height: 18px;
        background-color: #4c9ffe;
    }

    /* the circle */
    .isOver::after {
        top: -4px;
        left: -10px;
        width: 12px;
        height: 12px;
        border: 4px solid #4c9ffe;
        background: transparent;
        border-radius: 12px;
    }
`
