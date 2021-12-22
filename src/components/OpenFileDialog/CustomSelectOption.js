import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/CustomSelectOption.style.js'

export const CustomSelectOption = ({
    value,
    label,
    icon,
    onClick,
    active,
    disabled,
}) => (
    <div
        onClick={e => onClick({}, e)}
        data-value={value}
        data-label={label}
        className={cx({ active, disabled })}
    >
        {icon}
        <span className="label">{label}</span>
        <style jsx>{styles}</style>
    </div>
)

CustomSelectOption.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
}

export default CustomSelectOption
