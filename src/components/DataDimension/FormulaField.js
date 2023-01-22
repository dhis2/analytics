import PropTypes from 'prop-types'
import React from 'react'
import { parseExpression } from '../../modules/expressions.js'
import styles from './styles/FormulaField.style.js'

// FIXME: Only temporary, as the backend doesn't currently return proper metadata for the expression parts, listed as known issue #5 here: https://github.com/dhis2/analytics/pull/1370/
const tempMetadata = {
    fbfJHSPpUQD: 'ANC 1st visit',
    cYeuwXTCPkU: 'ANC 2nd visit',
    Jtf34kNZhzP: 'ANC 3rd visit',
}

const FormulaField = ({ expression, metadata = tempMetadata }) => {
    const renderParts = () => {
        const parseResult = parseExpression(expression).map((part) => {
            if (part.startsWith('#{') && part.endsWith('}')) {
                const id = part.slice(2, -1)
                return { value: part, label: metadata[id] }
            }
            return { value: part, label: part }
        })
        return parseResult.map((part, index) => (
            <span className="part" key={index}>
                {part.label}
            </span>
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
