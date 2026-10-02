import {
    fetchRelativePeriodTypeOptions,
    getItemsKey,
    parseItemsKey,
} from '../utils.js'

const settingsEngine = (settings) => ({
    query: jest.fn(async ({ setting }) => {
        const key = setting.resource.split('/')[1]

        if (!(key in settings)) {
            throw new Error('not found')
        }

        return { setting: { [key]: settings[key] } }
    }),
})

describe('fetchRelativePeriodTypeOptions', () => {
    it('reads the period types of relative weeks and financial years from the settings', async () => {
        expect(
            await fetchRelativePeriodTypeOptions(
                settingsEngine({
                    analyticsWeeklyStart: 'WEEKLY_WEDNESDAY',
                    analyticsFinancialYearStart: 'FINANCIAL_YEAR_APRIL',
                })
            )
        ).toEqual({
            weeklyPeriodType: 'WeeklyWednesday',
            financialYearPeriodType: 'FinancialApril',
        })
    })

    it('leaves out a setting the server doesn’t have', async () => {
        expect(
            await fetchRelativePeriodTypeOptions(
                settingsEngine({ analyticsWeeklyStart: 'WEEKLY' })
            )
        ).toEqual({
            weeklyPeriodType: 'Weekly',
            financialYearPeriodType: undefined,
        })
    })
})

describe('items keys', () => {
    it('compare items by value, and read them back', () => {
        const items = [{ id: 'elementAAAA', dimensionItemType: 'DATA_ELEMENT' }]
        const key = getItemsKey(items)

        expect(getItemsKey([...items])).toBe(key)
        expect(parseItemsKey(key)).toEqual(items)
    })

    it('accept ids alone, and no items', () => {
        expect(parseItemsKey(getItemsKey(['elementAAAA']))).toEqual([
            { id: 'elementAAAA', dimensionItemType: undefined },
        ])
        expect(getItemsKey()).toBe('[]')
    })
})
