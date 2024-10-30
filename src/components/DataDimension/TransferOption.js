import { IconEdit16, IconInfo16 } from '@dhis2/ui'
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
    dimensionType,
    dataTest,
    itemsRef,
    onEditClick,
    onInfoClick,
}) => {
    const renderContent = () => (
        <div
            className={cx('item', {
                highlighted,
                disabled,
                selected,
                inactive: active !== undefined && !active,
            })}
            data-test={`${dataTest}-content`}
            onClick={(event) => {
                console.log('transfer option click')
                if (disabled) {
                    return
                }
                onClick({ label, value }, event)
            }}
            onDoubleClick={(event) => {
                console.log('transfer option double click')
                if (disabled) {
                    return
                }
                onDoubleClick({ label, value }, event)
            }}
        >
            <div className="group">
                <span className="icon">{icon}</span>
                <span className="label">{label}</span>
                {onEditClick && (
                    <span
                        className="edit"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEditClick()
                        }}
                        data-test={`${dataTest}-edit-button`}
                    >
                        <IconEdit16 />
                    </span>
                )}
            </div>
            <div className={cx('group', 'nowrap')}>
                <span className="type">{dimensionType}</span>
                <span
                    className="info"
                    ref={(node) => {
                        node
                            ? itemsRef.current.set(value, node)
                            : itemsRef.current.delete(value)
                    }}
                    // avoid moving items when toggling the info popover
                    // sometimes a double click event is fired
                    onDoubleClick={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation()
                        onInfoClick()
                    }}
                    data-test={`${dataTest}-info-button`}
                >
                    <IconInfo16 />
                </span>
            </div>

            <style jsx>{styles}</style>
        </div>
    )

    return (
        <div data-value={value} data-test={dataTest} className="wrapper">
            {renderContent()}
        </div>
    )
}

TransferOption.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool,
    dataTest: PropTypes.string,
    dimensionType: PropTypes.string,
    disabled: PropTypes.bool,
    highlighted: PropTypes.bool,
    icon: PropTypes.node,
    itemsRef: PropTypes.object,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onInfoClick: PropTypes.func,
}
