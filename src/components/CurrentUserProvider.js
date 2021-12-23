import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'

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
    const [currentUser, setCurrentUser] = useState({})
    const [userSettings, setUserSettings] = useState([])
    const { data } = useDataQuery(query)

    useEffect(() => {
        if (data) {
            setCurrentUser(data.currentUser)

            const { keyAnalysisDisplayProperty, keyUiLocale, ...rest } =
                data.userSettings

            setUserSettings({
                ...rest,
                displayProperty: keyAnalysisDisplayProperty,
                displayNameProperty:
                    keyAnalysisDisplayProperty === 'name'
                        ? 'displayName'
                        : 'displayShortName',
                uiLocale: keyUiLocale,
            })
        }
    }, [data])

    return (
        <CurrentUserCtx.Provider
            value={{
                currentUser,
                userSettings,
            }}
        >
            {typeof children === 'function'
                ? children({ currentUser, userSettings })
                : children}
        </CurrentUserCtx.Provider>
    )
}

CurrentUserProvider.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

export default CurrentUserProvider

export const useCurrentUser = () => useContext(CurrentUserCtx)
