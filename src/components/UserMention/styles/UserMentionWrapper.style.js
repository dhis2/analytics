import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

/*
 * Note that the clone and clone > pre styles have been chosen
 * to emulate the styles of the textarea. If we decide to make
 * changes there, they should be refelcted here too.
 */
export const userMentionWrapperClasses = css`
    .wrapper {
        position: relative;
    }
    .clone {
        position: absolute;
        visibility: hidden;
        inset: 0;
        box-sizing: border-box;
        padding: ${spacers.dp8} ${spacers.dp12};
        border: 1px solid ${colors.grey500};
        font-size: 14px;
        line-height: ${spacers.dp16};
        z-index: 1;
        pointer-events: none;
    }
    .clone > pre {
        display: inline;
        word-wrap: break-word;
        overflow-wrap: break-word;
        font: inherit;
        margin: 0;
    }
    .container {
        background-color: ${colors.white};
        max-height: 180px;
        overflow: auto;
    }
`

export const resolvedHeaderStyle = css.resolve`
    position: sticky;
    top: 0;
`
