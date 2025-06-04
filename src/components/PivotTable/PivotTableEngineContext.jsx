import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

export const PivotTableEngineContext = createContext(null)

export const Provider = ({ engine, children }) => {
    return (
        <PivotTableEngineContext.Provider value={engine}>
            {children}
        </PivotTableEngineContext.Provider>
    )
}
Provider.propTypes = {
    engine: PropTypes.object.isRequired,
    children: PropTypes.node,
}

export const usePivotTableEngine = () => {
    return useContext(PivotTableEngineContext)
}
