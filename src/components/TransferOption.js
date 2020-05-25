import React, { useRef } from 'react'
import cx from 'classnames'
import propTypes from '@dhis2/prop-types'

import { colors, spacers, theme } from '@dhis2/ui-core'

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

    // TODO: Add hover text

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

            <style jsx>{`
                .wrapper:last-child {
                    margin-bottom: ${spacers.dp4};
                }
                .chip {
                    display: inline-block;
                    background: ${colors.grey200};
                    font-size: 14px;
                    line-height: 16px;
                    padding: 2px ${spacers.dp8} 2px ${spacers.dp4};
                    margin-top: ${spacers.dp4};
                    margin-left: ${spacers.dp8};
                    border-radius: 3px;
                    user-select: none;
                }

                .chip:hover {
                    background: ${colors.grey300};
                }

                .chip.highlighted {
                    background: ${theme.secondary800};
                    color: ${colors.white};
                }

                .chip.highlighted :global(.icon path) {
                    fill: ${colors.white};
                }

                .chip.disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .icon,
                .label {
                    line-height: 18px;
                }

                .icon {
                    margin-right: ${spacers.dp4};
                    display: inline-flex;
                    vertical-align: text-bottom;
                }

                .label {
                    font-size: 14px;
                }
            `}</style>
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
