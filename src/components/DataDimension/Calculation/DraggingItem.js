import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../../modules/dataTypes.js'
import { getIcon } from '../../../modules/dimensionListItem.js'
import {
    EXPRESSION_TYPE_DATA,
    EXPRESSION_TYPE_NUMBER,
    EXPRESSION_TYPE_OPERATOR,
} from '../../../modules/expressions.js'
import styles from './styles/DraggingItem.style.js'
import formulaItemStyles from './styles/FormulaItem.style.js'

const DraggingItem = ({ label, type, value }) => {
    const displayLabel =
        type === EXPRESSION_TYPE_NUMBER ? value || label : label

    return (
        <>
            <div
                className={cx('dragging', 'content', {
                    operator: type === EXPRESSION_TYPE_OPERATOR,
                    number: type === EXPRESSION_TYPE_NUMBER,
                    data: type === EXPRESSION_TYPE_DATA,
                })}
            >
                {type === EXPRESSION_TYPE_DATA && (
                    <span className="icon">
                        {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                    </span>
                )}
                <span className="label">{displayLabel}</span>
            </div>
            <style jsx>{styles}</style>
            <style jsx>{formulaItemStyles}</style>
        </>
    )
}

DraggingItem.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
}

export default DraggingItem
