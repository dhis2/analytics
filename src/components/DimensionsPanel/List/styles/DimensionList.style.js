// Fix for vertical flex scrolling in Firefox/Safari:
// Wrap the list in a div with position:relative (and flex:1 instead of on the list)
// On the list, set position:absolute, width:100%, height:100%

export const styles = {
    listWrapper: {
        position: 'relative',
        flex: '1 1 0%',
        minHeight: '30vh',
    },
    list: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        marginTop: '0px',
    },
}
