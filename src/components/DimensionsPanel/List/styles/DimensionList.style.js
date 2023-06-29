import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

// Fix for vertical flex scrolling in Firefox/Safari:
// Wrap the list in a div with position:relative (and flex:1 instead of on the list)
// On the list, set position:absolute, width:100%, height:100%

export default css`
    .container {
        position: relative;
        flex: 1 1 0%;
        min-height: 30vh;
    }
    .wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: auto;
        margin-top: 0;
        padding: 0;
    }
    .list {
        margin: 0;
        padding: 0;
    }
    .header {
        text-transform: uppercase;
        font-size: 11px;
        color: ${colors.grey600};
        margin: 0 0 ${spacers.dp8} 0;
        letter-spacing: 0.3px;
        font-weight: 400;
    }
    .section:not(:last-child) {
        margin-bottom: ${spacers.dp24};
    }
`
