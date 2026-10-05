import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import { useRef } from 'react'
import { getRelativePeriodTypeOptions } from '../../modules/dataItemProfile/periods/periodTypes.js'

const SETTING_KEYS = ['analyticsWeeklyStart', 'analyticsFinancialYearStart']

// The server answers 404 (E1005) for a setting its version doesn't have
const isMissingSetting = (error) => error?.details?.httpStatusCode === 404

// A setting a version doesn't have is left out, never guessed
const fetchSetting = (engine, key, signal) =>
    engine
        .query({ setting: { resource: `systemSettings/${key}` } }, { signal })
        .then(({ setting }) => setting?.[key])
        .catch((error) => {
            if (isMissingSetting(error)) {
                return undefined
            }

            throw error
        })

export const fetchRelativePeriodTypeOptions = async (
    engine,
    { signal } = {}
) => {
    const values = await Promise.all(
        SETTING_KEYS.map((key) => fetchSetting(engine, key, signal))
    )

    return getRelativePeriodTypeOptions(
        Object.fromEntries(SETTING_KEYS.map((key, i) => [key, values[i]]))
    )
}

export const useCalendar = (calendar) => {
    const { systemInfo } = useConfig()

    return calendar ?? systemInfo?.calendar ?? 'gregory'
}

/* Items ({ id, dimensionItemType }) are compared by value, in any order, so
 * a new array with the same items sends no request */
export const getItemsKey = (items = []) =>
    JSON.stringify(
        items
            .map(({ id, dimensionItemType }) => [id, dimensionItemType])
            .sort(([a], [b]) => a.localeCompare(b))
    )

export const parseItemsKey = (itemsKey) =>
    JSON.parse(itemsKey).map(([id, dimensionItemType]) => ({
        id,
        dimensionItemType,
    }))

/* The latest engine, without making requests depend on its identity: a test
 * provider can give a new one on each render */
export const useEngineRef = () => {
    const engine = useDataEngine()
    const engineRef = useRef(engine)

    engineRef.current = engine

    return engineRef
}
