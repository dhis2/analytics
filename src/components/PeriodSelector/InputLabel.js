import React from 'react'
import PropTypes from 'prop-types'
import MuiLabel from '@material-ui/core/InputLabel'
import { withStyles } from '@material-ui/core/styles'

const styles = {
    inputLabel: {
        color: '#595959',
        whiteSpace: 'nowrap',
    },
}

const InputLabel = ({ classes, label }) => {
    return (
        <>
            <MuiLabel className={classes.inputLabel} htmlFor="period-type">
                {label}
            </MuiLabel>
        </>
    )
}

InputLabel.propTypes = {
    label: PropTypes.string.isRequired,
    classes: PropTypes.object,
}

export default withStyles(styles)(InputLabel)
