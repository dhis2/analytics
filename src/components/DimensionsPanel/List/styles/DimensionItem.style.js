import { colors, theme } from '@dhis2/ui-constants'

export const styles = {
    labelWrapper: {
        padding: '2px 5px 2px 0',
    },
    text: {
        color: colors.grey900,
        userSelect: 'none',
        cursor: 'pointer',
        wordBreak: 'break-word',
        fontSize: '14px',
    },
    textDeactivated: {
        cursor: 'auto',
        color: colors.grey500,
    },
    item: {
        display: 'flex',
        minHeight: '24px',
        marginTop: 3,
        marginBottom: 3,
        alignItems: 'center',
        borderRadius: '2px',
    },
    selected: {
        backgroundColor: theme.secondary100,
        fontWeight: 500,
    },
    fixedDimensionIcon: {
        paddingLeft: '6px',
        paddingBottom: '2px',
    },
    dynamicDimensionIcon: {
        paddingLeft: '9px',
        paddingRight: '9px',
    },
    iconWrapper: {
        display: 'flex',
        flexDirection: 'column',
        padding: '3px 8px 0 8px',
    },
    lockIcon: {
        fontSize: '14px',
        marginTop: '1px',
    },
    optionsWrapper: {
        position: 'relative',
        height: '24px',
        minWidth: '22px',
        left: '5px',
        alignSelf: 'start',
    },
    optionsButton: {
        border: 'none',
        background: 'none',
        outline: 'none',
        cursor: 'pointer',
        padding: '1px 0px 0px 0px',
    },
}
