import { useConfig } from '@dhis2/app-runtime'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchDataItemProfileMetadata } from '../../api/dataItemProfile.js'
import {
    fetchOrgUnitCoverage,
    getProfilesSources,
} from '../../api/orgUnitCoverage.js'
import { getDataItemProfile } from '../../modules/dataItemProfile/getDataItemProfile.js'
import { getDataItemProfileCompatibility } from '../../modules/dataItemProfile/getDataItemProfileCompatibility.js'
import { withOrgUnitSide } from '../../modules/dataItemProfile/orgUnitSide.js'
import {
    fetchRelativePeriodTypeOptions,
    getItemsKey,
    parseItemsKey,
    useCalendar,
    useEngineRef,
} from './utils.js'

/**
 * The profiles of data items, and whether a selection suits them
 * (capabilities 1 and 2).
 *
 * `items` are { id, dimensionItemType }, as in a visualization's dx items.
 * Each profile has its org unit side (the levels its data sets are assigned
 * at) unless `orgUnitLevels: false`; then it gets it once `orgUnits` are
 * given and their coverage is loaded.
 * `profiles` are keyed by item id. `getDataItemCompatibility(itemId,
 * { periods })` runs getDataItemProfileCompatibility on the item's profile,
 * with the server's settings for relative weeks and financial years, its
 * calendar and its version; it gives undefined for an item not loaded.
 *
 * With `orgUnits` (DV's org unit items), it also loads where the items' data
 * sets are assigned under them (fetchOrgUnitCoverage, `orgUnitCoverage`), so
 * `getDataItemCompatibility(itemId, { periods, orgUnits })` judges org units
 * too: any selection whose units it loaded, such as a level under one of
 * them.
 */
export const useDataItemProfiles = (
    items,
    { calendar, orgUnits, orgUnitLevels = true } = {}
) => {
    const engineRef = useEngineRef()
    const itemsKey = getItemsKey(items)
    const resolvedCalendar = useCalendar(calendar)
    const { serverVersion } = useConfig()
    const [state, setState] = useState({
        loading: false,
        error: undefined,
        metadata: undefined,
        options: {},
    })
    const [coverageState, setCoverageState] = useState({
        loading: false,
        error: undefined,
        coverage: undefined,
    })
    const orgUnitsKey = JSON.stringify(orgUnits ?? [])

    useEffect(() => {
        const engine = engineRef.current
        const requestedItems = parseItemsKey(itemsKey)
        let cancelled = false

        if (!requestedItems.length) {
            setState({ loading: false, metadata: undefined, options: {} })
            return undefined
        }

        setState((previous) => ({
            ...previous,
            loading: true,
            error: undefined,
        }))

        Promise.all([
            fetchDataItemProfileMetadata(engine, requestedItems, {
                orgUnitLevels,
            }),
            fetchRelativePeriodTypeOptions(engine),
        ])
            .then(([metadata, options]) => {
                if (!cancelled) {
                    setState({ loading: false, metadata, options })
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setState({ loading: false, error, options: {} })
                }
            })

        return () => {
            cancelled = true
        }
    }, [engineRef, itemsKey, orgUnitLevels])

    const metadataProfiles = useMemo(
        () =>
            state.metadata &&
            Object.fromEntries(
                parseItemsKey(itemsKey).map((item) => [
                    item.id,
                    getDataItemProfile(item, state.metadata),
                ])
            ),
        [itemsKey, state.metadata]
    )

    const sourcesKey = JSON.stringify(
        metadataProfiles
            ? getProfilesSources(Object.values(metadataProfiles))
            : null
    )
    const knownAssignedLevels = state.metadata?.dataSetOrgUnitLevels

    useEffect(() => {
        const engine = engineRef.current
        const sources = JSON.parse(sourcesKey)
        const requestedOrgUnits = JSON.parse(orgUnitsKey)
        let cancelled = false

        if (!sources || !requestedOrgUnits.length) {
            setCoverageState({ loading: false, coverage: undefined })
            return undefined
        }

        setCoverageState((previous) => ({
            ...previous,
            loading: true,
            error: undefined,
        }))

        fetchOrgUnitCoverage(engine, {
            sources,
            orgUnits: requestedOrgUnits,
            assignedLevels: knownAssignedLevels,
        })
            .then((coverage) => {
                if (!cancelled) {
                    setCoverageState({ loading: false, coverage })
                }
            })
            .catch((error) => {
                if (!cancelled) {
                    setCoverageState({ loading: false, error })
                }
            })

        return () => {
            cancelled = true
        }
    }, [engineRef, sourcesKey, orgUnitsKey, knownAssignedLevels])

    // Without the counts in the metadata, the coverage gives the org unit side
    const profiles = useMemo(
        () =>
            metadataProfiles &&
            Object.fromEntries(
                Object.entries(metadataProfiles).map(([id, profile]) => [
                    id,
                    profile.orgUnit || !coverageState.coverage
                        ? profile
                        : withOrgUnitSide(
                              profile,
                              coverageState.coverage.assignedLevels
                          ),
                ])
            ),
        [metadataProfiles, coverageState.coverage]
    )

    const options = useMemo(
        () => ({
            ...state.options,
            calendar: resolvedCalendar,
            serverVersion,
            orgUnitCoverage: coverageState.coverage,
        }),
        [state.options, resolvedCalendar, serverVersion, coverageState.coverage]
    )

    const getDataItemCompatibility = useCallback(
        (itemId, selection) =>
            profiles?.[itemId]
                ? getDataItemProfileCompatibility(
                      profiles[itemId],
                      selection,
                      options
                  )
                : undefined,
        [profiles, options]
    )

    return {
        loading: state.loading || coverageState.loading,
        error: state.error ?? coverageState.error,
        profiles,
        orgUnitCoverage: coverageState.coverage,
        relativePeriodTypes: state.options,
        getDataItemCompatibility,
    }
}
