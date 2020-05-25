import React, { useRef } from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import styles from './styles/TransferOption.style'

const DOUBLE_CLICK_MAX_DELAY = 500

export const TransferOption = ({
    disabled,
    label,
    highlighted,
    onClick,
    onDoubleClick,
    value,
    icon,
}) => {
    const doubleClickTimeout = useRef(null)

    // TODO: Add hover text / tooltip

    return (
        <div data-value={value} className="wrapper">
            <div
                className={cx('chip', { highlighted, disabled })}
                onClick={event => {
                    if (disabled) return

                    const option = { label, value }

                    if (doubleClickTimeout.current) {
                        clearTimeout(doubleClickTimeout.current)
                        doubleClickTimeout.current = null

                        onDoubleClick({ option }, event)
                    } else {
                        doubleClickTimeout.current = setTimeout(() => {
                            clearTimeout(doubleClickTimeout.current)
                            doubleClickTimeout.current = null
                        }, DOUBLE_CLICK_MAX_DELAY)

                        onClick({ option }, event)
                    }
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
    onClick: propTypes.func,
    onDoubleClick: propTypes.func,
}
