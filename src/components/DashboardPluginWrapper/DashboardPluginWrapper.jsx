import {
    useCacheableSection,
    CacheableSection,
    useConfig,
} from '@dhis2/app-runtime'
import { CenteredContent, CircularLoader, CssVariables, Layer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { getPWAInstallationStatus } from '../../modules/getPWAInstallationStatus.js'

const LoadingMask = () => {
    return (
        <Layer>
            <CenteredContent>
                <CircularLoader />
            </CenteredContent>
        </Layer>
    )
}

const CacheableSectionWrapper = ({ id, children, isParentCached }) => {
    const { startRecording, isCached, remove } = useCacheableSection(id)

    useEffect(() => {
        if (isParentCached && !isCached) {
            startRecording({ onError: console.error })
        } else if (!isParentCached && isCached) {
            // Synchronize cache state on load or prop update
            // -- a back-up to imperative `removeCachedData`
            remove()
        }
    }, [isCached, isParentCached, remove, startRecording])

    return (
        <CacheableSection id={id} loadingMask={<LoadingMask />}>
            {children}
        </CacheableSection>
    )
}

CacheableSectionWrapper.propTypes = {
    children: PropTypes.node,
    id: PropTypes.string,
    isParentCached: PropTypes.bool,
}

export const DashboardPluginWrapper = ({
    onInstallationStatusChange,
    children,
    cacheId,
    isParentCached,
    ...props
}) => {
    const { pwaEnabled } = useConfig()

    useEffect(() => {
        // Get & send PWA installation status now
        getPWAInstallationStatus({
            onStateChange: onInstallationStatusChange,
        }).then(onInstallationStatusChange)
    }, [onInstallationStatusChange])

    return props ? (
        <div
            style={{
                display: 'flex',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {pwaEnabled ? (
                <CacheableSectionWrapper
                    id={cacheId}
                    isParentCached={isParentCached}
                >
                    {children(props)}
                </CacheableSectionWrapper>
            ) : (
                children(props)
            )}
            <CssVariables colors spacers elevations />
        </div>
    ) : null
}

DashboardPluginWrapper.defaultProps = {
    isParentCached: false,
    onInstallationStatusChange: Function.prototype,
}

DashboardPluginWrapper.propTypes = {
    cacheId: PropTypes.string,
    children: PropTypes.func,
    isParentCached: PropTypes.bool,
    onInstallationStatusChange: PropTypes.func,
}
