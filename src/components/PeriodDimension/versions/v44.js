// v44: /configuration/dataOutputPeriodTypes returns the enabled period types
// with their relative periods nested, all with a `displayName` that already
// resolves label translation -> label -> default name for the requested locale.
// The client no longer derives any names, it only maps server period types to
// the client period type ids used for generating fixed periods.
import { useDataQuery } from '@dhis2/app-runtime'
import { useEffect, useMemo } from 'react'
import {
    RP_CATEGORY_TO_FP_DEPENDENCIES,
    SERVER_PT_TO_MULTI_CALENDAR_PT,
} from '../utils/enabledPeriodTypes.js'
import { getFixedPeriodsOptions } from '../utils/fixedPeriods.js'
import { FINANCIAL, filterPeriodTypesById } from '../utils/index.js'
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
            fields: 'name,displayName,relativePeriods',
            ...(locale && { locale }),
        }),
    },
    analysisRelativePeriod: {
        resource: 'systemSettings/keyAnalysisRelativePeriod',
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

const getV44RelativeOption = (categoryId, enabledTypes) => {
    const familyTypes = enabledTypes.filter((pt) =>
        RP_CATEGORY_TO_SERVER_PTS[categoryId].includes(pt.name)
    )
    const typeWithRelativePeriods = familyTypes.find(
        (pt) => Object.keys(pt.relativePeriods || {}).length
    )

    if (typeWithRelativePeriods) {
        const periods = getRelativePeriodsFromPeriodType(
            typeWithRelativePeriods
        )

        return {
            id: categoryId,
            name: typeWithRelativePeriods.displayName,
            getPeriods: () => periods,
        }
    }

    // The server does not return relative periods for this category, either
    // because the period type it nests them under is disabled (e.g. only
    // WeeklySunday is enabled) or because there is no such period type (the
    // financial year family). Fall back to the client relative periods.
    const clientOption = getRelativePeriodsOptionsById(categoryId)

    return (
        clientOption && {
            ...clientOption,
            name:
                familyTypes.length === 1
                    ? familyTypes[0].displayName
                    : clientOption.name,
        }
    )
}

const getV44RelativeOptions = ({ enabledTypes }) =>
    enabledTypes
        .map((pt) => getRelativeCategoryId(pt.name))
        .filter(
            (categoryId, index, categoryIds) =>
                categoryId && categoryIds.indexOf(categoryId) === index
        )
        .map((categoryId) => getV44RelativeOption(categoryId, enabledTypes))
        .filter(Boolean)

export const getV44PeriodTypeOptions = ({
    enabledPeriodTypesData,
    periodsSettings,
    excludedPeriodTypes,
}) => {
    const { enabledTypes } = enabledPeriodTypesData

    return {
        fixedOptions: filterPeriodTypesById(
            getV44FixedOptions({ enabledTypes, periodsSettings }),
            excludedPeriodTypes
        ),
        relativeOptions: filterPeriodTypesById(
            getV44RelativeOptions({ enabledTypes }),
            excludedPeriodTypes
        ),
    }
}
