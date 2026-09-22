import fixtures from '../../../__fixtures__/fixtures.js'
import DataEngineMock from '../__mocks__/DataEngine.js'
import AnalyticsEnrollments from '../AnalyticsEnrollments.js'
import AnalyticsRequest from '../AnalyticsRequest.js'

describe('analytics.enrollments', () => {
    let enrollments
    let request
    let dataEngineMock
    let fixture

    beforeEach(() => {
        dataEngineMock = new DataEngineMock()
        DataEngineMock.mockClear()
        enrollments = new AnalyticsEnrollments()
    })

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsEnrollments()).toThrowErrorMatchingSnapshot()
    })

    it('should use the dataEngine object when it is passed', () => {
        const dataEngineMockObject = {}

        enrollments = new AnalyticsEnrollments(dataEngineMockObject)

        expect(enrollments.dataEngine).toBe(dataEngineMockObject)
    })

    describe('.getAggregate()', () => {
        beforeEach(() => {
            enrollments = new AnalyticsEnrollments(new DataEngineMock())

            request = new AnalyticsRequest().withLimit(10)

            fixture = fixtures.get('/api/analytics/aggregate')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({
                    data: { ...fixture, metaData: undefined },
                    metaData: { metaData: fixture.metaData },
                })
            )
        })

        it('should be a function', () => {
            expect(enrollments.getAggregate).toBeInstanceOf(Function)
        })

        it('should resolve a promise with the merged data and metaData', () =>
            enrollments.getAggregate(request).then((data) => {
                expect(data.rows).toEqual(fixture.rows)
                expect(data.headers).toEqual(fixture.headers)
                expect(data.metaData).toEqual(fixture.metaData)
            }))

        it('should request data and metaData separately', async () => {
            await enrollments.getAggregate(request)

            const [queries, { variables }] = dataEngineMock.query.mock.calls[0]

            expect(queries.data.id(variables)).toBe('enrollments/aggregate')
            expect(queries.metaData.id(variables)).toBe('enrollments/aggregate')

            expect(queries.data.params(variables)).toMatchObject({
                skipMeta: true,
                skipData: false,
            })
            expect(queries.metaData.params(variables)).toMatchObject({
                skipMeta: false,
                skipData: true,
                includeMetadataDetails: true,
            })
        })
    })

    describe('.getQuery()', () => {
        beforeEach(() => {
            enrollments = new AnalyticsEnrollments(new DataEngineMock())

            request = new AnalyticsRequest()
                .addOrgUnitDimension('ImspTQPwCqd')
                .addDimension('WZbXY0S00lP.de0FEHSIoxh')
                .addDimension('WZbXY0S00lP.sWoqcoByYmD')
                .addPeriodFilter('LAST_MONTH')
                .withProgram('WSGAb5XwJ3Y')
                .withStage('WZbXY0S00lP')
                .withAsc('ENROLLMENTDATE')
                .withOuMode('DESCENDANTS')
                .withColumns('w75KJ2mc4zz')
                .withPage(1)
                .withPageSize(10)

            fixture = fixtures.get('/api/analytics/enrollments')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: fixture })
            )
        })

        it('should be a function', () => {
            expect(enrollments.getQuery).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            enrollments.getQuery(request).then((data) => {
                expect(data.width).toEqual(fixture.width)
                expect(data.height).toEqual(fixture.height)
            }))
    })
})
