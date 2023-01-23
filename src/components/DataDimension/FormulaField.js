import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import styles from './styles/FormulaField.style.js'

const partIsDimension = (part) => part.startsWith('#{') && part.endsWith('}')

const FormulaField = ({ expression }) => {
    const renderParts = () =>
        expression.map((part, index) => (
            <>
                <span
                    className={cx('part', {
                        dimension: partIsDimension(part.value),
                    })}
                    key={index}
                >
                    {partIsDimension(part.value) && (
                        <span className="icon">
                            {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                        </span>
                    )}
                    {part.label}
                </span>
                <style jsx>{styles}</style>
            </>
        ))
    return (
        <>
            <div className="wrapper">{renderParts()}</div>
            <style jsx>{styles}</style>
        </>
    )
}

FormulaField.propTypes = {
    expression: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string,
        })
    ),
}

export default FormulaField
