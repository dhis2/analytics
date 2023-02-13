import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import { TYPE_DATA_ELEMENT, TYPE_NUMBER, TYPE_OPERATOR } from './constants.js'
import styles from './styles/DraggingItem.style.js'

const DraggingItem = ({ label, type, value }) => {
    const displayLabel = type === TYPE_NUMBER ? value || label : label

    return (
        <>
            <div
                className={cx('dragging-item', {
                    operator: type === TYPE_OPERATOR,
                    number: type === TYPE_NUMBER,
                    'data-element': type === TYPE_DATA_ELEMENT,
                })}
            >
                {type === TYPE_DATA_ELEMENT && (
                    <span className="icon">
                        {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                    </span>
                )}
                <span>{displayLabel}</span>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

DraggingItem.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
}

export default DraggingItem
