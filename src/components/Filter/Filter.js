import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Search from '@material-ui/icons/Search'
import Close from '@material-ui/icons/Close'
import { withStyles } from '@material-ui/core/styles'

import { styles } from './styles/Filter.style'

let ref = null

const onChangeWrapper = (onChange, onClear, event) => {
    event.target.value.length ? onChange(event.target.value) : onClear()
}

const onKeyDownWrapper = (onClear, event, text) => {
    if (event.key === 'Escape') {
        event.preventDefault()
        !text.length && ref ? ref.blur() : onClear()
    }
}

export const Filter = props => (
    <TextField
        autoFocus={props.autoFocus}
        style={props.style}
        className={props.classes.inputContainer}
        placeholder={props.placeholder}
        value={props.text}
        onChange={e => onChangeWrapper(props.onChange, props.onClear, e)}
        onKeyDown={e => onKeyDownWrapper(props.onClear, e, props.text)}
        inputRef={node => (ref = node)}
        InputProps={{
            disableUnderline: props.disableUnderline,
            style: styles.placeholder,
            startAdornment: (
                <InputAdornment>
                    <Search style={styles.searchIcon} />
                </InputAdornment>
            ),
            endAdornment: props.text.length ? (
                <InputAdornment>
                    <IconButton
                        style={styles.iconButton}
                        onClick={props.onClear}
                        disableRipple
                    >
                        <Close style={styles.closeIcon} />
                    </IconButton>
                </InputAdornment>
            ) : null,
        }}
    />
)

Filter.defaultProps = {
    style: {},
    autoFocus: false,
    disableUnderline: false,
}

Filter.propTypes = {
    placeholder: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    classes: PropTypes.object,
    disableUnderline: PropTypes.bool,
    style: PropTypes.object,
}

export default withStyles(styles)(Filter)
