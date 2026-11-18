import AnalyticsRequest from '../AnalyticsRequest.js'
import AnalyticsTrackedEntities from '../AnalyticsTrackedEntities.js'

describe('AnalyticsTrackedEntities options', () => {
    it.each([['getQuery', 'fetch', 'trackedEntities/query']])(
        '.%s() should pass options to .%s()',
        async (method, target, path) => {
            const instance = new AnalyticsTrackedEntities({})
            const spy = jest.spyOn(instance, target).mockResolvedValue({})
            const options = { signal: new AbortController().signal }

            await instance[method](new AnalyticsRequest(), options)

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({ path }),
                options
            )
        }
    )
})
