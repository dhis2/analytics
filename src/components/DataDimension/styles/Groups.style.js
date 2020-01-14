import { colors } from '../../../modules/colors'

export const styles = {
    container: {
        border: `1px solid ${colors.greyLight}`,
        display: 'flex',
        minHeight: '53px',
        borderRight: '0px',
        borderLeft: '0px',
        paddingTop: '5px',
        paddingLeft: '5px',
    },
    groupContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: 'inherit',
        minWidth: '316px',
        flexGrow: 1,
        paddingRight: '5px',
    },
    titleText: {
        color: colors.greyDark,
        fontSize: '13px',
        fontWeight: '300',
        paddingBottom: '10px',
    },
    dropDown: {
        padding: '0px',
    },

    placeholder: {
        padding: '0px',
        fontWeight: '300',
    },
}
