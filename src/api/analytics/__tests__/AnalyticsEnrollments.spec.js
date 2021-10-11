import fixtures from '../../../__fixtures__/fixtures'
import DataEngineMock from '../__mocks__/DataEngine'
import AnalyticsEnrollments from '../AnalyticsEnrollments'
import AnalyticsRequest from '../AnalyticsRequest'

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
            enrollments.getQuery(request).then(data => {
                expect(data.width).toEqual(fixture.width)
                expect(data.height).toEqual(fixture.height)
            }))
    })
})
