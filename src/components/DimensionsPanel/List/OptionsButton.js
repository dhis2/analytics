import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'

import MoreHorizontalIcon from '../../../assets/MoreHorizontalIcon'

export const OptionsButton = ({ style, onClick }) => (
    <IconButton style={style} onClick={onClick}>
        <MoreHorizontalIcon />
    </IconButton>
)

OptionsButton.propTypes = {
    style: PropTypes.object,
    onClick: PropTypes.func,
}

export default OptionsButton
