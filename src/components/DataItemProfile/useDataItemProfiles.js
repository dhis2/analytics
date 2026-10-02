import { useConfig } from '@dhis2/app-runtime'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCountableSources } from '../../api/dataItemProfile/assignedOrgUnitCounts.js'
import { fetchDataItemProfileMetadata } from '../../api/dataItemProfile/fetchDataItemProfileMetadata.js'
import { fetchOrgUnitCoverage } from '../../api/dataItemProfile/fetchOrgUnitCoverage.js'
import { getDataItemProfile } from '../../modules/dataItemProfile/getDataItemProfile.js'
import { getDataItemProfileCompatibility } from '../../modules/dataItemProfile/getDataItemProfileCompatibility.js'
import { addAssignedOrgUnitLevels } from '../../modules/dataItemProfile/profile/assignedOrgUnitLevels.js'
import {
    fetchRelativePeriodTypeOptions,
    getItemsKey,
    parseItemsKey,
    useCalendar,
    useEngineRef,
} from './utils.js'

/**
 * The profiles of data items, and whether a selection suits them.
 *
 * `items` are { id, dimensionItemType }, as in a visualization's dx items.
 * `profiles` are keyed by item id. Each has its assigned org unit levels
 * unless `withAssignedOrgUnitCounts: false`; it then gets them once
 * `orgUnits` are given and their coverage is loaded.
 *
 * `getDataItemCompatibility(itemId, { periods, orgUnits })` runs
 * getDataItemProfileCompatibility on the item's profile, with the server's
 * settings for relative weeks and financial years, its calendar and its
 * version; it gives undefined for an item not loaded.
 *
 * Periods need no request, so they are only passed to
 * getDataItemCompatibility. Org units do: `orgUnits` (DV's org unit items)
 * loads where the items' data sets and programs are assigned under them
 * (fetchOrgUnitCoverage, `orgUnitCoverage`), so getDataItemCompatibility can
 * judge any selection whose org units it loaded, such as a level under one of
 * them.
 */
export const useDataItemProfiles = (
    items,
    { calendar, orgUnits, withAssignedOrgUnitCounts = true } = {}
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
                withAssignedOrgUnitCounts,
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
    }, [engineRef, itemsKey, withAssignedOrgUnitCounts])

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
            ? getCountableSources(Object.values(metadataProfiles))
            : null
    )
    const knownAssignedOrgUnitCounts = state.metadata?.assignedOrgUnitCounts

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
            assignedOrgUnitCounts: knownAssignedOrgUnitCounts,
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
    }, [engineRef, sourcesKey, orgUnitsKey, knownAssignedOrgUnitCounts])

    // Without the counts in the metadata, the coverage gives the assigned org unit levels
    const profiles = useMemo(
        () =>
            metadataProfiles &&
            Object.fromEntries(
                Object.entries(metadataProfiles).map(([id, profile]) => [
                    id,
                    profile.assignedOrgUnitLevels || !coverageState.coverage
                        ? profile
                        : addAssignedOrgUnitLevels(
                              profile,
                              coverageState.coverage.assignedOrgUnitCounts
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
