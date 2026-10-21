// v44: /configuration/dataOutputPeriodTypes returns the enabled period types
// with their relative periods nested, all with a `displayName` that already
// resolves label translation -> label -> default name. No locale is passed, so
// the server uses the user's db locale (keyDbLocale), like for other metadata.
// The client no longer derives any names, it only maps server period types to
// the client period type ids used for generating fixed periods.
// Weekly and financial year relative periods have one set of labels; the
// analyticsWeeklyStart and analyticsFinancialYearStart system settings decide
// which start variant they refer to.
import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useMemo } from 'react'
import {
    FY_SETTING_TO_SERVER_PT,
    RP_CATEGORY_TO_FP_DEPENDENCIES,
    SERVER_PT_TO_MULTI_CALENDAR_PT,
    WEEKLY_START_TO_SERVER_PT,
} from '../utils/enabledPeriodTypes.js'
import { getFixedPeriodsOptions } from '../utils/fixedPeriods.js'
import { FINANCIAL, WEEKLY, filterPeriodTypesById } from '../utils/index.js'

const v44Query = {
    periodTypes: {
        resource: 'configuration/dataOutputPeriodTypes',
        params: {
            fields: 'name,displayName,relativePeriods',
        },
    },
    analysisRelativePeriod: {
        resource: 'systemSettings/keyAnalysisRelativePeriod',
    },
    weeklyStart: {
        resource: 'systemSettings/analyticsWeeklyStart',
    },
    financialYearStart: {
        resource: 'systemSettings/analyticsFinancialYearStart',
    },
}

// Server period types grouped by the relative period category they belong to.
// The category ids (e.g. WEEKLY, FINANCIAL) are part of the public API
// (excludedPeriodTypes, default selection) and the server has no equivalent.
const RP_CATEGORY_TO_SERVER_PTS = {
    ...RP_CATEGORY_TO_FP_DEPENDENCIES,
    [FINANCIAL]: [
        'FinancialFeb',
        'FinancialApril',
        'FinancialJuly',
        'FinancialAug',
        'FinancialSep',
        'FinancialOct',
        'FinancialNov',
    ],
}

const getRelativeCategoryId = (serverPtName) =>
    Object.keys(RP_CATEGORY_TO_SERVER_PTS).find((categoryId) =>
        RP_CATEGORY_TO_SERVER_PTS[categoryId].includes(serverPtName)
    )

const getRelativePeriodsFromPeriodType = (periodType) =>
    Object.entries(periodType.relativePeriods || {}).map(
        ([id, { displayName }]) => ({ id, name: displayName })
    )

export const useV44DataOutputPeriodTypes = ({ enabled }) => {
    const { data, error, refetch } = useDataQuery(v44Query, { lazy: true })

    useEffect(() => {
        if (enabled) {
            refetch()
        }
    }, [enabled, refetch])

    return useMemo(() => {
        if (!enabled || error || !data?.periodTypes) {
            return null
        }

        // the server returns period types in natural order (days -> financial years)
        const enabledTypes = data.periodTypes

        // relative period id -> name, used for overriding stored names
        // (i.e. selected items in a saved visualization)
        const metaData = enabledTypes
            .flatMap(getRelativePeriodsFromPeriodType)
            .reduce((acc, { id, name }) => {
                acc[id] = { name }
                return acc
            }, {})

        return {
            version: 44,
            enabledTypes,
            analysisRelativePeriod:
                data.analysisRelativePeriod?.keyAnalysisRelativePeriod || null,
            // server period type names of the start variants the weekly and
            // financial year relative periods refer to
            relativePeriodStartTypes: {
                [WEEKLY]:
                    WEEKLY_START_TO_SERVER_PT[
                        data.weeklyStart?.analyticsWeeklyStart
                    ] || WEEKLY_START_TO_SERVER_PT.WEEKLY,
                [FINANCIAL]:
                    FY_SETTING_TO_SERVER_PT[
                        data.financialYearStart?.analyticsFinancialYearStart
                    ] || null,
            },
            metaData,
            noEnabledTypes: enabledTypes.length === 0,
        }
    }, [enabled, data, error])
}

const getV44FixedOptions = ({ enabledTypes, periodsSettings }) => {
    const clientOptionsById = getFixedPeriodsOptions(periodsSettings).reduce(
        (acc, option) => {
            acc[option.id] = option
            return acc
        },
        {}
    )

    return enabledTypes
        .map((pt) => {
            const option =
                clientOptionsById[SERVER_PT_TO_MULTI_CALENDAR_PT[pt.name]]

            // server period types without client support for generating periods are skipped
            return option && { ...option, name: pt.displayName || option.name }
        })
        .filter(Boolean)
}

const getV44RelativeOption = (
    categoryId,
    enabledTypes,
    relativePeriodStartTypes
) => {
    const familyTypes = enabledTypes.filter((pt) =>
        RP_CATEGORY_TO_SERVER_PTS[categoryId].includes(pt.name)
    )

    // The server nests the relative periods of a family under every period
    // type of the family. Weekly and financial year relative periods refer to
    // the start variant selected in the system settings, so they are only
    // available when that variant is enabled.
    const startTypeName = relativePeriodStartTypes?.[categoryId]
    const sourceType =
        startTypeName !== undefined
            ? familyTypes.find((pt) => pt.name === startTypeName)
            : familyTypes[0]

    const periods = sourceType
        ? getRelativePeriodsFromPeriodType(sourceType)
        : []

    if (!periods.length) {
        return null
    }

    return {
        id: categoryId,
        name: sourceType.displayName,
        getPeriods: () => periods,
    }
}

const getV44RelativeOptions = ({ enabledTypes, relativePeriodStartTypes }) =>
    enabledTypes
        .map((pt) => getRelativeCategoryId(pt.name))
        .filter(
            (categoryId, index, categoryIds) =>
                categoryId && categoryIds.indexOf(categoryId) === index
        )
        .map((categoryId) =>
            getV44RelativeOption(
                categoryId,
                enabledTypes,
                relativePeriodStartTypes
            )
        )
        .filter(Boolean)

export const getV44PeriodTypeOptions = ({
    enabledPeriodTypesData,
    periodsSettings,
    excludedPeriodTypes,
}) => {
    const { enabledTypes, relativePeriodStartTypes } = enabledPeriodTypesData

    return {
        fixedOptions: filterPeriodTypesById(
            getV44FixedOptions({ enabledTypes, periodsSettings }),
            excludedPeriodTypes
        ),
        relativeOptions: filterPeriodTypesById(
            getV44RelativeOptions({ enabledTypes, relativePeriodStartTypes }),
            excludedPeriodTypes
        ),
    }
}
