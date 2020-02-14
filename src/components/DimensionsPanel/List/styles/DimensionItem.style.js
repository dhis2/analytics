import { colors } from '../../../../modules/colors'

export const styles = {
    labelWrapper: {
        maxWidth: '174px',
        padding: '2px 0',
    },
    text: {
        color: colors.black,
        userSelect: 'none',
        cursor: 'pointer',
        wordBreak: 'break-word',
        fontSize: '14px',
    },
    textDeactivated: {
        cursor: 'auto',
        color: colors.grey,
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
        backgroundColor: colors.accentSecondaryTransparent,
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
