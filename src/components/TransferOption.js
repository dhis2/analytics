import React from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'
import GenericIcon from '../assets/DimensionItemIcons/GenericIcon'

import styles from './styles/TransferOption.style'

export const TransferOption = ({
    disabled,
    label,
    highlighted,
    onClick,
    onDoubleClick,
    value,
    //icon,
}) => {
    return (
        <div data-value={value} className="wrapper">
            <div
                className={cx('chip', { highlighted, disabled })}
                onClick={event => {
                    if (disabled) return
                    onClick({ label, value }, event)
                }}
                onDoubleClick={event => {
                    if (disabled) return
                    onDoubleClick({ label, value }, event)
                }}
            >
                <span className="icon">{GenericIcon}</span>
                {
                    // TODO: reimplement the custom icon, as different Dimensions need different icons
                }
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
    //icon: propTypes.node,
    onClick: propTypes.func,
    onDoubleClick: propTypes.func,
}
