import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Layer, CenteredContent, CircularLoader, NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'

const CachedDataQueryCtx = createContext({})

const CachedDataQueryProvider = ({
    query,
    dataTransformation,
    children,
    translucent = true,
}) => {
    const { data: rawData, error, loading } = useDataQuery(query)
    const [transformedData, setTransformedData] = useState(undefined)
    const [transformLoading, setTransformLoading] = useState(false)
    const [transformError, setTransformError] = useState(null)

    useEffect(() => {
        let isMounted = true

        const transform = async () => {
            if (!rawData || !dataTransformation) {
                setTransformedData(rawData)
                return
            }

            try {
                const result = dataTransformation(rawData)

                if (result instanceof Promise) {
                    setTransformLoading(true)
                    const awaitedResult = await result
                    isMounted && setTransformedData(awaitedResult)
                } else {
                    isMounted && setTransformedData(result)
                }
            } catch (err) {
                isMounted && setTransformError(err)
            } finally {
                isMounted && setTransformLoading(false)
            }
        }

        transform()

        return () => {
            isMounted = false
        }
    }, [rawData, dataTransformation])

    if (loading || transformLoading) {
        return (
            <Layer translucent={translucent}>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    if (error || transformError) {
        const fallbackMsg = i18n.t('This app could not retrieve required data.')
        return (
            <NoticeBox error title={i18n.t('Network error')}>
                {error?.message || transformError?.message || fallbackMsg}
            </NoticeBox>
        )
    }

    return (
        <CachedDataQueryCtx.Provider value={transformedData}>
            {children}
        </CachedDataQueryCtx.Provider>
    )
}

CachedDataQueryProvider.propTypes = {
    children: PropTypes.node.isRequired,
    query: PropTypes.object.isRequired,
    dataTransformation: PropTypes.func,
    translucent: PropTypes.bool,
}

const useCachedDataQuery = () => useContext(CachedDataQueryCtx)

export { CachedDataQueryProvider, useCachedDataQuery }
