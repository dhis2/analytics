import React from 'react'
import PropTypes from 'prop-types'
import { IconMore16 } from '@dhis2/ui'

export const OptionsButton = ({ style, onClick }) => (
    <button style={style} onClick={onClick}>
        <IconMore16 />
    </button>
)

OptionsButton.propTypes = {
    style: PropTypes.object,
    onClick: PropTypes.func,
}

export default OptionsButton
