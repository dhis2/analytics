// v43: enabled period types from /configuration/dataOutputPeriodTypes, with a
// single `label` per period type. Relative period names are derived client side
// from that label ("This {label}", "Last {label}", ...).
// Remove this file (and its branch in useDataOutputPeriodTypes and
// getPeriodTypeOptions) when v43 is no longer supported.
import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useMemo } from 'react'
import {
    RP_CATEGORY_TO_FP_DEPENDENCIES,
    SERVER_PT_TO_MULTI_CALENDAR_PT,
    FY_SETTING_TO_SERVER_PT,
    WEEKLY_START_TO_SERVER_PT,
    applyPeriodNameOverrides,
    filterEnabledFixedPeriodTypes,
} from '../utils/enabledPeriodTypes.js'
import { getFixedPeriodsOptions } from '../utils/fixedPeriods.js'
import { filterPeriodTypesById } from '../utils/index.js'
import { getRelativePeriodsOptions } from '../utils/relativePeriods.js'

const v43Query = {
    enabledPeriodTypes: {
        resource: 'configuration/dataOutputPeriodTypes',
    },
    financialYearStart: {
        resource: 'systemSettings/analyticsFinancialYearStart',
    },
    analysisRelativePeriod: {
        resource: 'systemSettings/keyAnalysisRelativePeriod',
    },
    weeklyStart: {
        resource: 'systemSettings/analyticsWeeklyStart',
    },
}

export const useV43DataOutputPeriodTypes = ({ enabled }) => {
    const {
        data: v43Data,
        error: v43Error,
        refetch: v43Refetch,
    } = useDataQuery(v43Query, { lazy: true })

    useEffect(() => {
        if (enabled) {
            v43Refetch()
        }
    }, [enabled, v43Refetch])

    return useMemo(() => {
        if (!enabled) {
            return null
        }

        if (v43Error || !v43Data?.enabledPeriodTypes) {
            return null
        }

        const enabledTypes = v43Data.enabledPeriodTypes

        if (!enabledTypes || enabledTypes.length === 0) {
            return {
                version: 43,
                enabledTypes: [],
                financialYearStart: null,
                analysisRelativePeriod: null,
                noEnabledTypes: true,
            }
        }

        let financialYearStart = null
        let financialYearDisplayLabel = null
        if (v43Data.financialYearStart?.analyticsFinancialYearStart) {
            const fyStartValue =
                v43Data.financialYearStart.analyticsFinancialYearStart

            const mappedFyPt = FY_SETTING_TO_SERVER_PT[fyStartValue]
            const matchingPt = enabledTypes.find((pt) => pt.name === mappedFyPt)
            if (matchingPt) {
                financialYearStart = fyStartValue
                if (matchingPt.displayLabel) {
                    financialYearDisplayLabel = matchingPt.displayLabel
                }
            }
        }

        let weeklyDisplayLabel = null
        if (v43Data.weeklyStart?.analyticsWeeklyStart) {
            const weeklyStartValue = v43Data.weeklyStart.analyticsWeeklyStart

            const mappedWeeklyPt = WEEKLY_START_TO_SERVER_PT[weeklyStartValue]
            const matchingWeeklyPt = enabledTypes.find(
                (pt) => pt.name === mappedWeeklyPt
            )
            if (matchingWeeklyPt?.displayLabel) {
                weeklyDisplayLabel = matchingWeeklyPt.displayLabel
            }
        }

        const analysisRelativePeriod =
            v43Data.analysisRelativePeriod?.keyAnalysisRelativePeriod || null

        const metaData = {
            ...(financialYearDisplayLabel && {
                THIS_FINANCIAL_YEAR: {
                    name: `This ${financialYearDisplayLabel}`,
                },
                LAST_FINANCIAL_YEAR: {
                    name: `Last ${financialYearDisplayLabel}`,
                },
                LAST_5_FINANCIAL_YEARS: {
                    name: `Last 5 ${financialYearDisplayLabel}`,
                },
            }),
            ...(weeklyDisplayLabel && {
                THIS_WEEK: {
                    name: `This ${weeklyDisplayLabel}`,
                },
                LAST_WEEK: {
                    name: `Last ${weeklyDisplayLabel}`,
                },
                LAST_4_WEEKS: {
                    name: `Last 4 ${weeklyDisplayLabel}`,
                },
                LAST_12_WEEKS: {
                    name: `Last 12 ${weeklyDisplayLabel}`,
                },
                LAST_52_WEEKS: {
                    name: `Last 52 ${weeklyDisplayLabel}`,
                },
                WEEKS_THIS_YEAR: {
                    name: `${weeklyDisplayLabel} this year`,
                },
            }),
        }

        return {
            version: 43,
            enabledTypes,
            financialYearStart,
            financialYearDisplayLabel,
            weeklyDisplayLabel,
            analysisRelativePeriod,
            metaData,
            noEnabledTypes: false,
        }
    }, [enabled, v43Data, v43Error])
}

/**
 * Apply displayLabel overrides to fixed period type names
 */
export const applyFixedPeriodTypeDisplayLabels = (
    filteredFixedOptions,
    enabledServerPeriodTypes
) => {
    if (!enabledServerPeriodTypes) {
        return filteredFixedOptions
    }

    const displayLabelMap = new Map()
    enabledServerPeriodTypes.forEach((pt) => {
        if (pt.displayLabel) {
            const multiCalendarPt = SERVER_PT_TO_MULTI_CALENDAR_PT[pt.name]
            if (multiCalendarPt) {
                displayLabelMap.set(multiCalendarPt, pt.displayLabel)
            }
        }
    })

    if (displayLabelMap.size === 0) {
        return filteredFixedOptions
    }

    return filteredFixedOptions.map((option) => {
        const displayLabel = displayLabelMap.get(option.id)
        return displayLabel ? { ...option, name: displayLabel } : option
    })
}

/**
 * Apply display label overrides to relative period options
 */
export const applyDisplayLabelOverrides = (
    filteredRelativeOptions,
    { financialYearDisplayLabel, weeklyDisplayLabel, metaData }
) => {
    const overrides = {}

    if (financialYearDisplayLabel) {
        overrides['FINANCIAL'] = { name: financialYearDisplayLabel }
    }
    if (weeklyDisplayLabel) {
        overrides['WEEKLY'] = { name: weeklyDisplayLabel }
    }

    if (Object.keys(overrides).length === 0) {
        return filteredRelativeOptions
    }

    return filteredRelativeOptions.map((option) => {
        const override = overrides[option.id]
        if (!override) {
            return option
        }
        return {
            ...option,
            name: override.name,
            getPeriods: () =>
                applyPeriodNameOverrides(option.getPeriods(), metaData),
        }
    })
}

/**
 * Filter relative period categories based on enabled server period types
 * @param {Array} allRelativePeriodOptions - All available relative period options
 * @param {Array} enabledServerPeriodTypes - Enabled period types from server
 * @param {string|null} financialYearStart - Financial year start setting (if enabled)
 * @returns {Array} Filtered relative period options
 */
export const filterEnabledRelativePeriodTypes = (
    allRelativePeriodOptions,
    enabledServerPeriodTypes,
    financialYearStart = null
) => {
    if (!enabledServerPeriodTypes || enabledServerPeriodTypes.length === 0) {
        return []
    }

    const enabledServerPtNames = new Set(
        enabledServerPeriodTypes.map((pt) => pt.name)
    )

    return allRelativePeriodOptions.filter((option) => {
        // Special handling for financial years
        if (option.id === 'FINANCIAL') {
            return financialYearStart !== null
        }

        // Check if any of the required FP dependencies are enabled
        const requiredFpTypes = RP_CATEGORY_TO_FP_DEPENDENCIES[option.id]
        if (!requiredFpTypes) {
            return true // Show if no dependency mapping (shouldn't happen)
        }

        return requiredFpTypes.some((fpType) =>
            enabledServerPtNames.has(fpType)
        )
    })
}

export const getV43PeriodTypeOptions = ({
    enabledPeriodTypesData,
    periodsSettings,
    excludedPeriodTypes,
}) => {
    const {
        enabledTypes,
        financialYearStart,
        financialYearDisplayLabel,
        weeklyDisplayLabel,
        metaData,
    } = enabledPeriodTypesData

    return {
        fixedOptions: filterPeriodTypesById(
            applyFixedPeriodTypeDisplayLabels(
                filterEnabledFixedPeriodTypes(
                    getFixedPeriodsOptions(periodsSettings),
                    enabledTypes
                ),
                enabledTypes
            ),
            excludedPeriodTypes
        ),
        relativeOptions: filterPeriodTypesById(
            applyDisplayLabelOverrides(
                filterEnabledRelativePeriodTypes(
                    getRelativePeriodsOptions(),
                    enabledTypes,
                    financialYearStart
                ),
                { financialYearDisplayLabel, weeklyDisplayLabel, metaData }
            ),
            excludedPeriodTypes
        ),
    }
}
