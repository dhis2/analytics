import fixtures from '../../../__fixtures__/fixtures.js'
import DataEngineMock from '../__mocks__/DataEngine.js'
import AnalyticsAggregate from '../AnalyticsAggregate.js'
import AnalyticsRequest from '../AnalyticsRequest.js'

const debugSqlFixture = `select de.name as de_name, de.uid as de_uid, de.dataelementid as de_id, pe.startdate as
start_date, pe.enddate as end_date, pt.name as pt_name, ou.name as ou_name, ou.uid as ou_uid, ou.organisationunitid as
ou_id, coc.name as coc_name, coc.uid as coc_uid, coc.categoryoptioncomboid as coc_id, aoc.name as aoc_name, aoc.uid as
aoc_uid, aoc.categoryoptioncomboid as aoc_id, dv.value as datavalue from datavalue dv inner join dataelement de on
dv.dataelementid = de.dataelementid inner join period pe on dv.periodid = pe.periodid inner join periodtype pt on
pe.periodtypeid = pt.periodtypeid inner join organisationunit ou on dv.sourceid = ou.organisationunitid inner join
categoryoptioncombo coc on dv.categoryoptioncomboid = coc.categoryoptioncomboid inner join categoryoptioncombo aoc on
dv.attributeoptioncomboid = aoc.categoryoptioncomboid where dv.dataelementid in (359596,359597) and ((pe.startdate >=
    '2016-01-01' and pe.enddate <= '2016-03-31') or (pe.startdate >= '2016-04-01' and pe.enddate <= '2016-06-30') ) and
((dv.sourceid in (select organisationunitid from _orgunitstructure where idlevel2 = 264)) ) and dv.deleted is false
limit 100000`

describe('Analytics.aggregate', () => {
    let aggregate
    let request
    let dataEngineMock
    let fixture

    beforeEach(() => {
        dataEngineMock = new DataEngineMock()
        DataEngineMock.mockClear()
        aggregate = new AnalyticsAggregate()
    })

    it('should not be allowed to be called without new', () => {
        expect(() => AnalyticsAggregate()).toThrowErrorMatchingSnapshot()
    })

    it('should use the dataEngine object when it is passed', () => {
        const dataEngineMockObject = {}

        aggregate = new AnalyticsAggregate(dataEngineMockObject)

        expect(aggregate.dataEngine).toBe(dataEngineMockObject)
    })

    describe('.getDataValueSet()', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new DataEngineMock())

            request = new AnalyticsRequest()

            request
                .addDataDimension([
                    'fbfJHSPpUQD.pq2XI5kz2BY',
                    'fbfJHSPpUQD.PT59n8BQbqM',
                ])
                .addPeriodDimension('LAST_MONTH')
                .addOrgUnitDimension('ImspTQPwCqd')

            fixture = fixtures.get('/api/analytics/dataValueSet')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: fixture })
            )
        })

        it('should be a function', () => {
            expect(aggregate.getDataValueSet).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            aggregate.getDataValueSet(request).then((data) => {
                expect(data.dataValues.length).toEqual(
                    fixture.dataValues.length
                )
            }))
    })

    describe('.getDebugSql()', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new DataEngineMock())

            request = new AnalyticsRequest()

            request
                .addDataDimension(['fbfJHSPpUQD', 'cYeuwXTCPkU'])
                .addPeriodFilter(['2016Q1', '2016Q2'])
                .addOrgUnitFilter('O6uvpzGd5pu')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: debugSqlFixture })
            )
        })

        it('should be a function', () => {
            expect(aggregate.getDebugSql).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            aggregate.getDebugSql(request).then((data) => {
                expect(data).toEqual(debugSqlFixture)
            }))
    })

    describe('.getRawData', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new DataEngineMock())

            request = new AnalyticsRequest()

            request
                .addDataDimension(['fbfJHSPpUQD', 'cYeuwXTCPkU', 'Jtf34kNZhzP'])
                .addDimension('J5jldMd8OHv')
                .addDimension('Bpx0589u8y0')
                .addOrgUnitDimension(['O6uvpzGd5pu', 'fdc6uOvgoji'])
                .withStartDate('2016-01-01')
                .withEndDate('2016-01-31')

            fixture = fixtures.get('/api/analytics/rawData')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: fixture })
            )
        })

        it('should be a function', () => {
            expect(aggregate.getRawData).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            aggregate.getRawData(request).then((data) => {
                expect(data.metaData.items).toEqual(fixture.metaData.items)
                expect(data.metaData.dimensions).toEqual(
                    fixture.metaData.dimensions
                )
                expect(data.width).toEqual(0)
                expect(data.height).toEqual(0)
            }))
    })

    describe('.getOutliersData', () => {
        beforeEach(() => {
            aggregate = new AnalyticsAggregate(new DataEngineMock())

            request = new AnalyticsRequest()

            request.withParameters({
                dx: 'fbfJHSPpUQD,cYeuwXTCPkU',
                pe: 'THIS_YEAR',
                ou: 'at6UHUQatSo',
                headers:
                    'dxname,pename,ouname,value,absdev,modifiedzscore,median,lowerbound,upperbound',
                algorithm: 'MOD_Z_SCORE',
                maxResults: 100,
                threshold: 3,
            })

            fixture = fixtures.get('/api/analytics/outlierDetection')

            dataEngineMock.query.mockReturnValue(
                Promise.resolve({ data: fixture })
            )
        })

        it('should be a function', () => {
            expect(aggregate.getOutliersData).toBeInstanceOf(Function)
        })

        it('should resolve a promise with data', () =>
            aggregate.getOutliersData(request).then((data) => {
                expect(data.metaData.items).toEqual(fixture.metaData.items)
                expect(data.metaData.dimensions).toEqual(
                    fixture.metaData.dimensions
                )
                expect(data.headers).toEqual(fixture.headers)
                expect(data.width).toEqual(8)
                expect(data.height).toEqual(13)
            }))
    })
})
