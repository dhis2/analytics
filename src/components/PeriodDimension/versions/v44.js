// v44: /configuration/dataOutputPeriodTypes returns the enabled period types
// with their relative periods nested, all with a `displayName` that already
// resolves label translation -> label -> default name for the requested locale.
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
import { getRelativePeriodsOptionsById } from '../utils/relativePeriods.js'

const userLocaleQuery = {
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale'],
        },
    },
}

const v44Query = {
    periodTypes: {
        resource: 'configuration/dataOutputPeriodTypes',
        params: ({ locale }) => ({
            fields: 'name,displayName,frequencyOrder,relativePeriods',
            ...(locale && { locale }),
        }),
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

// The server nests relative periods under a single period type of a family
// (e.g. weekly relative periods under "Weekly" only), while the client groups
// relative periods in categories that are shown when any period type in the
// family is enabled
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

// Natural order (days -> financial years), not relying on the response order.
// frequencyOrder ties (e.g. weekly variants, yearly and financial years) are
// broken by the client order of period types.
const CLIENT_PT_ORDER = Object.keys(SERVER_PT_TO_MULTI_CALENDAR_PT)

const getClientOrder = (name) => {
    const index = CLIENT_PT_ORDER.indexOf(name)
    return index === -1 ? CLIENT_PT_ORDER.length : index
}

export const sortPeriodTypes = (periodTypes) =>
    [...periodTypes].sort(
        (a, b) =>
            (a.frequencyOrder ?? Infinity) - (b.frequencyOrder ?? Infinity) ||
            getClientOrder(a.name) - getClientOrder(b.name)
    )

const getRelativePeriodsFromPeriodType = (periodType) =>
    Object.entries(periodType.relativePeriods || {}).map(
        ([id, { displayName }]) => ({ id, name: displayName })
    )

export const useV44DataOutputPeriodTypes = ({ enabled }) => {
    const { data, error, refetch } = useDataQuery(v44Query, { lazy: true })
    const { refetch: fetchUserLocale } = useDataQuery(userLocaleQuery, {
        lazy: true,
        onComplete: ({ userSettings }) =>
            refetch({ locale: userSettings?.keyUiLocale }),
        onError: () => refetch({}),
    })

    useEffect(() => {
        if (enabled) {
            fetchUserLocale()
        }
    }, [enabled, fetchUserLocale])

    return useMemo(() => {
        if (!enabled || error || !data?.periodTypes) {
            return null
        }

        const enabledTypes = sortPeriodTypes(data.periodTypes)

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

    // Weekly and financial year relative periods are only available when the
    // start variant selected in the system settings is enabled
    const startTypeName = relativePeriodStartTypes?.[categoryId]
    const startType =
        startTypeName !== undefined
            ? familyTypes.find((pt) => pt.name === startTypeName)
            : null

    if (startTypeName !== undefined && !startType) {
        return null
    }

    const typeWithRelativePeriods = familyTypes.find(
        (pt) => Object.keys(pt.relativePeriods || {}).length
    )

    // The server does not return relative periods for this category when the
    // period type it nests them under is disabled (e.g. weekly relative periods
    // are nested under Weekly while only WeeklySunday is enabled) or when there
    // is no such period type (financial year relative periods).
    // Fall back to the client relative periods.
    const clientOption = getRelativePeriodsOptionsById(categoryId)

    if (!typeWithRelativePeriods && !clientOption) {
        return null
    }

    const periods = typeWithRelativePeriods
        ? getRelativePeriodsFromPeriodType(typeWithRelativePeriods)
        : clientOption.getPeriods()

    return {
        id: categoryId,
        name:
            startType?.displayName ||
            typeWithRelativePeriods?.displayName ||
            clientOption.name,
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
