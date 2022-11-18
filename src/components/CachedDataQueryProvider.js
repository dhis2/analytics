import { useDataQuery } from '@dhis2/app-runtime'
import { Layer, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'
import i18n from '../locales/index.js'

const CachedDataQueryCtx = createContext({})

const CachedDataQueryProvider = ({ query, dataTransformation, children }) => {
    const { data: rawData, ...rest } = useDataQuery(query)
    const { error, loading } = rest
    const data =
        rawData && dataTransformation ? dataTransformation(rawData) : rawData

    if (loading) {
        return (
            <Layer translucent>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    if (error) {
        const fallbackMsg = i18n.t('This app could not retrieve required data.')

        return (
            <NoticeBox error title={i18n.t('Network error')}>
                {error.message || fallbackMsg}
            </NoticeBox>
        )
    }

    return (
        <CachedDataQueryCtx.Provider value={data}>
            {children}
        </CachedDataQueryCtx.Provider>
    )
}

CachedDataQueryProvider.propTypes = {
    children: PropTypes.node.isRequired,
    query: PropTypes.object.isRequired,
    dataTransformation: PropTypes.func,
}

const useCachedDataQuery = () => useContext(CachedDataQueryCtx)

export { CachedDataQueryProvider, useCachedDataQuery }
