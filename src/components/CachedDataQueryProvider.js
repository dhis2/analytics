import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Layer, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createContext, useContext } from 'react'

const CachedDataQueryCtx = createContext({})

const CachedDataQueryProvider = ({
    query,
    dataTransformation,
    children,
    disableSwr,
}) => {
    const { data: rawData, ...rest } = useDataQuery(query)
    const { error, loading, fetching } = rest
    const data =
        rawData && dataTransformation ? dataTransformation(rawData) : rawData
    const providerValue = { ...rest, data }

    /*
     * Apps might want to control what gets rendered, for example:
     * - If there are nested providers and a single loader/error UI is preferred
     * - Showing the default loader and error message is not suitable
     * For these cases we support renderProps
     */
    if (typeof children === 'function') {
        return (
            <CachedDataQueryCtx.Provider value={providerValue}>
                children(providerValue)
            </CachedDataQueryCtx.Provider>
        )
    }

    /*
     * Render loader only when data is unavailable
     * Render loader over the top of the children when data is stale (SWR)
     */
    if (loading || fetching) {
        return (
            <>
                <Layer translucent>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
                {!loading && !disableSwr && (
                    <CachedDataQueryCtx.Provider value={providerValue}>
                        {children}
                    </CachedDataQueryCtx.Provider>
                )}
            </>
        )
    }

    if (error) {
        const fallbackMsg = i18n.t('This app could not retrieve required data.')

        return (
            <NoticeBox title={i18n.t('Network error')}>
                {error.message || fallbackMsg}
            </NoticeBox>
        )
    }

    return (
        <CachedDataQueryCtx.Provider value={providerValue}>
            {children}
        </CachedDataQueryCtx.Provider>
    )
}

CachedDataQueryProvider.propTypes = {
    children: PropTypes.node.isRequired,
    query: PropTypes.object.isRequired,
    dataTransformation: PropTypes.func,
    disableSwr: PropTypes.bool,
}

const useCachedDataQuery = () => useContext(CachedDataQueryCtx)

export { CachedDataQueryProvider, useCachedDataQuery }
