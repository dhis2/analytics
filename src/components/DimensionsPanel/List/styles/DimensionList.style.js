import { colors, spacers } from '@dhis2/ui'

// Fix for vertical flex scrolling in Firefox/Safari:
// Wrap the list in a div with position:relative (and flex:1 instead of on the list)
// On the list, set position:absolute, width:100%, height:100%

export const styles = {
    container: {
        position: 'relative',
        flex: '1 1 0%',
        minHeight: '30vh',
    },
    wrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        marginTop: '0px',
        padding: 0,
    },
    list: {
        margin: 0,
        padding: 0,
    },
    header: {
        textTransform: 'uppercase',
        fontSize: '11px',
        color: colors.grey700,
        margin: '5px 0',
        letterSpacing: '0.3px',
    },
    section: {
        '&:not(:last-child)': {
            marginBottom: spacers.dp24,
        },
    },
}
