import { useDataEngine } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { createContext, useState } from 'react'
import { InterpretationsManager } from './InterpretationsManager.js'

export const InterpretationsContext = createContext(null)

export const InterpretationsProvider = ({ currentUser, children }) => {
    const dataEngine = useDataEngine()
    const [interpretationsManager] = useState(
        () => new InterpretationsManager(dataEngine, currentUser)
    )
    return (
        <InterpretationsContext.Provider value={interpretationsManager}>
            {children}
        </InterpretationsContext.Provider>
    )
}

InterpretationsProvider.propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.object,
}
