import { useConfig } from '@dhis2/app-runtime'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getDataItemProfileSourceKeys } from '../../api/dataItemProfile/assignedOrgUnitCounts.js'
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
 * version, and `relativePeriodDate` for relative periods (today by default);
 * it gives undefined for an item not loaded. Its results are kept until the
 * profiles or options change.
 *
 * Periods need no request, so they are only passed to
 * getDataItemCompatibility. Org units do: `orgUnits` (DV's org unit items)
 * loads where the items' data sets and programs are assigned under them
 * (fetchOrgUnitCoverage, `orgUnitCoverage`), so getDataItemCompatibility can
 * judge any selection whose org units it loaded, such as a level under one of
 * them.
 *
 * Changes fetch only what is missing: metadata of new items, counts of new
 * org units. While new items load, the loaded ones keep their profiles.
 */
export const useDataItemProfiles = (
    items,
    {
        calendar,
        orgUnits,
        relativePeriodDate,
        withAssignedOrgUnitCounts = true,
    } = {}
) => {
    const engineRef = useEngineRef()
    const itemsKey = getItemsKey(items)
    const resolvedCalendar = useCalendar(calendar)
    const { serverVersion } = useConfig()
    const [settingsState, setSettingsState] = useState({
        loading: true,
        error: undefined,
        options: {},
    })
    const [state, setState] = useState({
        loading: false,
        error: undefined,
        metadata: undefined,
        metadataItemsKey: undefined,
    })
    const [coverageState, setCoverageState] = useState({
        loading: false,
        error: undefined,
        coverage: undefined,
        coverageKey: undefined,
    })
    const metadataRef = useRef()
    const coverageRef = useRef()
    const orgUnitsKey = JSON.stringify(orgUnits ?? [])

    metadataRef.current = state.metadata
    coverageRef.current = coverageState.coverage

    // The settings don't change with the items: fetched once
    useEffect(() => {
        const controller = new AbortController()

        fetchRelativePeriodTypeOptions(engineRef.current, {
            signal: controller.signal,
        })
            .then((options) => setSettingsState({ loading: false, options }))
            .catch((error) => {
                if (!controller.signal.aborted) {
                    setSettingsState({ loading: false, error, options: {} })
                }
            })

        return () => controller.abort()
    }, [engineRef])

    useEffect(() => {
        const requestedItems = parseItemsKey(itemsKey)
        const controller = new AbortController()

        if (!requestedItems.length) {
            setState({ loading: false, metadata: metadataRef.current })
            return undefined
        }

        setState((previous) => ({
            ...previous,
            loading: true,
            error: undefined,
        }))

        fetchDataItemProfileMetadata(engineRef.current, requestedItems, {
            withAssignedOrgUnitCounts,
            known: metadataRef.current,
            signal: controller.signal,
        })
            .then((metadata) => {
                if (!controller.signal.aborted) {
                    setState({
                        loading: false,
                        metadata,
                        metadataItemsKey: itemsKey,
                    })
                }
            })
            .catch((error) => {
                if (!controller.signal.aborted) {
                    setState((previous) => ({
                        ...previous,
                        loading: false,
                        error,
                        metadataItemsKey: undefined,
                    }))
                }
            })

        return () => controller.abort()
    }, [engineRef, itemsKey, withAssignedOrgUnitCounts])

    /* Profiles from the metadata of the items it was fetched for: while new
     * items load, the others keep theirs */
    const metadataProfiles = useMemo(() => {
        const loadedIds = new Set(
            state.metadataItemsKey
                ? parseItemsKey(state.metadataItemsKey).map(({ id }) => id)
                : []
        )
        const loadedItems = parseItemsKey(itemsKey).filter(({ id }) =>
            loadedIds.has(id)
        )

        return loadedItems.length
            ? Object.fromEntries(
                  loadedItems.map((item) => [
                      item.id,
                      getDataItemProfile(item, state.metadata),
                  ])
              )
            : undefined
    }, [itemsKey, state.metadata, state.metadataItemsKey])

    const sourceKeysKey = JSON.stringify(
        metadataProfiles
            ? getDataItemProfileSourceKeys(Object.values(metadataProfiles))
            : null
    )
    const coverageKey = `${sourceKeysKey}|${orgUnitsKey}`
    const knownAssignedOrgUnitCounts = state.metadata?.assignedOrgUnitCounts

    useEffect(() => {
        const sourceKeys = JSON.parse(sourceKeysKey)
        const requestedOrgUnits = JSON.parse(orgUnitsKey)
        const controller = new AbortController()

        if (!sourceKeys || !requestedOrgUnits.length) {
            setCoverageState({ loading: false, coverage: coverageRef.current })
            return undefined
        }

        setCoverageState((previous) => ({
            ...previous,
            loading: true,
            error: undefined,
        }))

        fetchOrgUnitCoverage(engineRef.current, {
            sourceKeys,
            orgUnits: requestedOrgUnits,
            assignedOrgUnitCounts: knownAssignedOrgUnitCounts,
            previous: coverageRef.current,
            signal: controller.signal,
        })
            .then((coverage) => {
                if (!controller.signal.aborted) {
                    setCoverageState({
                        loading: false,
                        coverage,
                        coverageKey: `${sourceKeysKey}|${orgUnitsKey}`,
                    })
                }
            })
            .catch((error) => {
                if (!controller.signal.aborted) {
                    setCoverageState((previous) => ({
                        ...previous,
                        loading: false,
                        error,
                        coverageKey: undefined,
                    }))
                }
            })

        return () => controller.abort()
    }, [engineRef, sourceKeysKey, orgUnitsKey, knownAssignedOrgUnitCounts])

    // Only the coverage of these sources and org units, never an earlier one
    const coverage =
        coverageState.coverageKey === coverageKey
            ? coverageState.coverage
            : undefined

    /* None before the settings, which relative periods need. Without the
     * counts in the metadata, the coverage gives the assigned org unit levels. */
    const profiles = useMemo(() => {
        if (settingsState.loading || !metadataProfiles) {
            return undefined
        }

        return Object.fromEntries(
            Object.entries(metadataProfiles).map(([id, profile]) => [
                id,
                profile.assignedOrgUnitLevels || !coverage
                    ? profile
                    : addAssignedOrgUnitLevels(
                          profile,
                          coverage.assignedOrgUnitCounts
                      ),
            ])
        )
    }, [settingsState.loading, metadataProfiles, coverage])

    const options = useMemo(
        () => ({
            ...settingsState.options,
            calendar: resolvedCalendar,
            relativePeriodDate,
            serverVersion,
            orgUnitCoverage: coverage,
        }),
        [
            settingsState.options,
            resolvedCalendar,
            relativePeriodDate,
            serverVersion,
            coverage,
        ]
    )

    // A list of items asks for the same results on every render
    const getDataItemCompatibility = useMemo(() => {
        const results = new Map()

        return (itemId, selection) => {
            if (!profiles?.[itemId]) {
                return undefined
            }

            const key = JSON.stringify([itemId, selection])

            if (!results.has(key)) {
                results.set(
                    key,
                    getDataItemProfileCompatibility(
                        profiles[itemId],
                        selection,
                        options
                    )
                )
            }

            return results.get(key)
        }
    }, [profiles, options])

    return {
        loading:
            state.loading ||
            coverageState.loading ||
            (settingsState.loading && itemsKey !== '[]'),
        profiles,
        error: settingsState.error ?? state.error ?? coverageState.error,
        orgUnitCoverage: coverage,
        relativePeriodTypes: settingsState.options,
        getDataItemCompatibility,
    }
}
