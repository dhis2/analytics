import React from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import styles from './styles/TransferOption.style'

export const TransferOption = ({
    disabled,
    label,
    highlighted,
    selected,
    onClick,
    onDoubleClick,
    value,
    icon,
}) => {
    return (
        <div data-value={value} className="wrapper">
            <div
                className={cx('chip', { highlighted, disabled, selected })}
                onClick={event => {
                    if (disabled) return
                    onClick({ label, value }, event)
                }}
                onDoubleClick={event => {
                    if (disabled) return
                    onDoubleClick({ label, value }, event)
                }}
            >
                <span className="icon">{icon}</span>
                <span className="label">{label}</span>
            </div>

            <style jsx>{styles}</style>
        </div>
    )
}

TransferOption.propTypes = {
    label: propTypes.string.isRequired,
    value: propTypes.string.isRequired,
    disabled: propTypes.bool,
    highlighted: propTypes.bool,
    icon: propTypes.node,
    selected: propTypes.bool,
    onClick: propTypes.func,
    onDoubleClick: propTypes.func,
}
