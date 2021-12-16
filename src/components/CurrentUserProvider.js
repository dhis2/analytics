import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

const query = {
    currentUser: {
        resource: 'me',
        params: {
            fields: 'id,username,displayName~rename(name)',
        },
    },
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale', 'keyAnalysisDisplayProperty'],
        },
    },
}

const CurrentUserCtx = createContext({})

export const CurrentUserProvider = ({ children }) => {
    const { data, loading, error } = useDataQuery(query)
    const { keyAnalysisDisplayProperty, keyUiLocale, ...rest } =
        data.userSettings
    const providerData = {
        currentUser: data.currentUser,
        userSettings: {
            ...rest,
            displayProperty: keyAnalysisDisplayProperty,
            displayNameProperty:
                keyAnalysisDisplayProperty === 'name'
                    ? 'displayName'
                    : 'displayShortName',
            uiLocale: keyUiLocale,
        },
        loading,
        error,
    }

    return (
        <CurrentUserCtx.Provider value={providerData}>
            {typeof children === 'function' ? children(providerData) : children}
        </CurrentUserCtx.Provider>
    )
}

CurrentUserProvider.propTypes = {
    children: PropTypes.node,
}

export default CurrentUserProvider

export const useCurrentUser = () => useContext(CurrentUserCtx)
