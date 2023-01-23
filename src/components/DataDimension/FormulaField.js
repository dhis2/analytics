import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import { parseExpression } from '../../modules/expressions.js'
import styles from './styles/FormulaField.style.js'

// FIXME: Only temporary, as the backend doesn't currently return proper metadata for the expression parts, listed as known issue #5 here: https://github.com/dhis2/analytics/pull/1370/
const tempMetadata = {
    fbfJHSPpUQD: 'ANC 1st visit',
    cYeuwXTCPkU: 'ANC 2nd visit',
    Jtf34kNZhzP: 'ANC 3rd visit',
}

const partIsDimension = (part) => part.startsWith('#{') && part.endsWith('}')

const FormulaField = ({ expression, metadata = tempMetadata }) => {
    const renderParts = () => {
        const parseResult = parseExpression(expression).map((part) => {
            if (partIsDimension(part)) {
                const id = part.slice(2, -1)
                return { value: part, label: metadata[id] }
            }
            return { value: part, label: part }
        })
        return parseResult.map((part, index) => (
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
    }
    return (
        <>
            <div className="wrapper">{renderParts()}</div>
            <style jsx>{styles}</style>
        </>
    )
}

FormulaField.propTypes = {
    expression: PropTypes.string,
    metadata: PropTypes.object,
}

export default FormulaField
