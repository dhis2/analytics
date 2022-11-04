import { Tooltip, IconEdit16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/TransferOption.style.js'

export const TransferOption = ({
    disabled,
    label,
    highlighted,
    selected,
    onClick,
    onDoubleClick,
    value,
    icon,
    active,
    tooltipText,
    dataTest,
    onEditClick,
}) => {
    const renderContent = () => (
        <div
            className={cx('chip', {
                highlighted,
                disabled,
                selected,
                inactive: active !== undefined && !active,
            })}
            data-test={`${dataTest}-content`}
            onClick={(event) => {
                if (disabled) {
                    return
                }
                onClick({ label, value }, event)
            }}
            onDoubleClick={(event) => {
                if (disabled) {
                    return
                }
                onDoubleClick({ label, value }, event)
            }}
        >
            <span className="icon">{icon}</span>
            <span className="label">{label}</span>
            {onEditClick && (
                <span
                    className="edit"
                    onClick={(e) => {
                        e.stopPropagation()
                        onEditClick()
                    }}
                >
                    <IconEdit16 />
                </span>
            )}

            <style jsx>{styles}</style>
        </div>
    )

    return (
        <div data-value={value} data-test={dataTest} className="wrapper">
            {tooltipText ? (
                <Tooltip
                    key={`${value}`}
                    content={tooltipText}
                    placement={'top'}
                    openDelay={750}
                    closeDelay={150}
                >
                    {renderContent()}
                </Tooltip>
            ) : (
                renderContent()
            )}
        </div>
    )
}

TransferOption.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    highlighted: PropTypes.bool,
    icon: PropTypes.node,
    selected: PropTypes.bool,
    tooltipText: PropTypes.string,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onEditClick: PropTypes.func,
}
