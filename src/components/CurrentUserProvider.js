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

const tranformUserSettings = (userSettings) => {
    if (!userSettings) {
        return undefined
    }

    const { keyAnalysisDisplayProperty, keyUiLocale, ...rest } = userSettings

    return {
        ...rest,
        displayProperty: keyAnalysisDisplayProperty,
        displayNameProperty:
            keyAnalysisDisplayProperty === 'name'
                ? 'displayName'
                : 'displayShortName',
        uiLocale: keyUiLocale,
    }
}

export const CurrentUserProvider = ({ children }) => {
    const { data, loading, error } = useDataQuery(query)
    const providerData = {
        currentUser: data?.currentUser,
        userSettings: tranformUserSettings(data?.userSettings),
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
