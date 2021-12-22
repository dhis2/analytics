import fixtures from '../../../__fixtures__/fixtures.js'
import DataEngineMock from '../__mocks__/DataEngine.js'
import AnalyticsEvents from '../AnalyticsEvents.js'
import AnalyticsRequest from '../AnalyticsRequest.js'

describe('analytics.events', () => {
    let events
    let request
    let dataEngineMock
    let fixture

    beforeEach(() => {
        dataEngineMock = new DataEngineMock()
        DataEngineMock.mockClear()
        events = new AnalyticsEvents()
    })

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsEvents()).toThrowErrorMatchingSnapshot()
    })

    it('should use the dataEngine object when it is passed', () => {
        const dataEngineMockObject = {}

        events = new AnalyticsEvents(dataEngineMockObject)

        expect(events.dataEngine).toBe(dataEngineMockObject)
    })

    describe('.getAggregate()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents(new DataEngineMock())

            request = new AnalyticsRequest().withLimit(10)

            fixture = fixtures.get('/api/analytics/aggregate')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: fixture })
            )
        })

        it('should be a function', () => {
            expect(events.getAggregate).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            events.getAggregate(request).then(data => {
                expect(data).toEqual(fixture)
            }))
    })

    describe('.getCount()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents(new DataEngineMock())

            request = new AnalyticsRequest()
                .withProgram('eBAyeGv0exc')
                .addPeriodDimension('LAST_YEAR')
                .addOrgUnitDimension('ImspTQPwCqd')
                .addDimension('qrur9Dvnyt5:LT:50')

            fixture = fixtures.get('/api/analytics/count')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: fixture })
            )
        })

        it('should be a function', () => {
            expect(events.getCount).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            events.getCount(request).then(data => {
                expect(data.count).toEqual(fixture.count)
                expect(data.extent).toEqual(fixture.extent)
            }))
    })

    describe('.getCluster()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents(new DataEngineMock())

            request = new AnalyticsRequest()
                .withProgram('VBqh0ynB2wv')
                .addOrgUnitDimension('ImspTQPwCqd')
                .withStage('pTo4uMt3xur')
                .withStartDate('2016-10-17')
                .withEndDate('2017-10-17')
                .withCoordinatesOnly(true)
                .withBbox(
                    '-14.062500000000002,5.61598581915534,-11.25,8.407168163601076'
                )
                .withClusterSize(67265)
                .withIncludeClusterPoints(false)

            fixture = fixtures.get('/api/analytics/cluster')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: fixture })
            )
        })

        it('should be a function', () => {
            expect(events.getCluster).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            events.getCluster(request).then(data => {
                expect(data.width).toEqual(fixture.width)
                expect(data.height).toEqual(fixture.height)
            }))
    })

    describe('.getQuery()', () => {
        beforeEach(() => {
            events = new AnalyticsEvents(new DataEngineMock())

            request = new AnalyticsRequest()
                .addOrgUnitDimension('ImspTQPwCqd')
                .addDimension('qrur9Dvnyt5:LT:50')
                .addPeriodFilter('LAST_MONTH')
                .withStage('Zj7UnCAulEk')
                .withPage(1)
                .withPageSize(5)

            fixture = fixtures.get('/api/analytics/query')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: fixture })
            )
        })

        it('should be a function', () => {
            expect(events.getQuery).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            events.getQuery(request).then(data => {
                expect(data.width).toEqual(fixture.width)
                expect(data.height).toEqual(fixture.height)
            }))
    })
})
