import { IconEdit16, IconInfo16 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import { DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM } from '../../modules/dataTypes.js'
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
    dataItemType,
    dimensionType,
    dataTest,
    itemsRef,
    showingInfo,
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
            <div className="labelGroup">
                <span className="icon">{icon}</span>
                <span className="label">{label}</span>
                {dataItemType === DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM &&
                    onEditClick && (
                        <div className="tag">
                            <span
                                className="edit"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onEditClick()
                                }}
                                data-test={`${dataTest}-edit-calculation-button`}
                            >
                                <IconEdit16 />
                                {i18n.t('Edit')}
                            </span>
                        </div>
                    )}
                )}
            </div>
            <div className={cx('group', 'nowrap', 'typeGroup')}>
                <span className="type">{dimensionType}</span>
                <span
                    className={cx('info', {
                        active: showingInfo,
                    })}
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
    dataItemType: PropTypes.string,
    dataTest: PropTypes.string,
    dimensionType: PropTypes.string,
    disabled: PropTypes.bool,
    highlighted: PropTypes.bool,
    icon: PropTypes.node,
    itemsRef: PropTypes.object,
    selected: PropTypes.bool,
    showingInfo: PropTypes.bool,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onEditClick: PropTypes.func,
    onInfoClick: PropTypes.func,
}
