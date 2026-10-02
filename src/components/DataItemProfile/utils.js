import { useConfig, useDataEngine } from '@dhis2/app-runtime'
import { useRef } from 'react'
import { getRelativePeriodTypeOptions } from '../../modules/dataItemProfile/periodTypes.js'

const SETTING_KEYS = ['analyticsWeeklyStart', 'analyticsFinancialYearStart']

// A setting a version doesn't have is left out, never guessed
const fetchSetting = (engine, key) =>
    engine
        .query({ setting: { resource: `systemSettings/${key}` } })
        .then(({ setting }) => setting?.[key])
        .catch(() => undefined)

export const fetchRelativePeriodTypeOptions = async (engine) => {
    const values = await Promise.all(
        SETTING_KEYS.map((key) => fetchSetting(engine, key))
    )

    return getRelativePeriodTypeOptions(
        Object.fromEntries(SETTING_KEYS.map((key, i) => [key, values[i]]))
    )
}

export const useCalendar = (calendar) => {
    const { systemInfo } = useConfig()

    return calendar ?? systemInfo?.calendar ?? 'gregory'
}

// Items are compared by value, so a new array with the same items sends no request
export const getItemsKey = (items = []) =>
    JSON.stringify(
        items.map((item) =>
            typeof item === 'string'
                ? [item]
                : [item.id, item.dimensionItemType]
        )
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
