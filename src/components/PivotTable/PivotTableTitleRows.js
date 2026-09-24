import PropTypes from 'prop-types'
import React from 'react'
import getFilterText from '../../visualizations/util/getFilterText.js'
import { usePivotTableEngine } from './PivotTableEngineContext.js'
import { PivotTableTitleRow } from './PivotTableTitleRow.js'

/* Whether there is a filter row at all is the layout's call, as it has
 * always been. `filterText` only says what goes in it: supplied by the
 * caller when there is one, derived from the layout when there is not. */
const getFilterRowTitle = (engine) =>
    engine.options.filterText ??
    getFilterText(engine.visualization.filters, engine.rawData.metaData)

export const PivotTableTitleRows = ({ clippingResult, width }) => {
    const engine = usePivotTableEngine()

    return (
        <>
            {engine.options.title ? (
                <PivotTableTitleRow
                    title={engine.options.title}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                />
            ) : null}
            {engine.options.subtitle ? (
                <PivotTableTitleRow
                    title={engine.options.subtitle}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                />
            ) : null}
            {engine.visualization.filters?.length ? (
                <PivotTableTitleRow
                    title={getFilterRowTitle(engine)}
                    scrollPosition={clippingResult.scrollPosition}
                    containerWidth={width}
                />
            ) : null}
        </>
    )
}

PivotTableTitleRows.propTypes = {
    clippingResult: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
}
