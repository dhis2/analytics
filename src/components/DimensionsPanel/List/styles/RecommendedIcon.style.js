import { colors, theme } from '@dhis2/ui-constants'

export const styles = {
    toolTip: {
        color: colors.white,
        backgroundColor: '#4a4a4a',
        boxShadow: 'none',
        width: '160px',
        borderRadius: '3px',
        position: 'relative',
        top: '5px',
        fontSize: '12px',
        padding: '7px 9px',
    },
    recommendedIcon: {
        backgroundColor: theme.secondary300,
        height: '8px',
        width: '8px',
        borderRadius: '4px',
        marginLeft: '5px',
        display: 'inline-block',
        cursor: 'pointer',
    },
}
