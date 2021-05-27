import {
    getFixedPeriodsOptionsById,
    getFixedPeriodsOptions,
    parsePeriodCode,
    getYearOffsetFromNow,
} from '../utils/fixedPeriods'

describe('fixedPeriods utils', () => {
    beforeAll(() =>
        // 2019-06-17
        jest.spyOn(Date, 'now').mockImplementation(() => 1560765600000)
    )

    describe('getOptions', () => {
        it('should return a list of available period ranges', () => {
            const periodIds = getFixedPeriodsOptions().map(option => option.id)

            expect(periodIds).toEqual([
                'DAILY',
                'WEEKLY',
                'WEEKLYWED',
                'WEEKLYTHU',
                'WEEKLYSAT',
                'WEEKLYSUN',
                'BIWEEKLY',
                'MONTHLY',
                'BIMONTHLY',
                'QUARTERLY',
                'SIXMONTHLY',
                'SIXMONTHLYAPR',
                'YEARLY',
                'FYNOV',
                'FYOCT',
                'FYJUL',
                'FYAPR',
            ])
        })
    })

    describe('Daily period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('DAILY')

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of days in 2019', () => {
            expect(periods.length).toEqual(365)
        })

        it('should return the correct object for 1 jan 2019 day', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-01-01',
                iso: '20190101',
                id: '20190101',
            })
            expect(periods[0].name).toEqual('2019-01-01')
        })

        it('should return the correct object for 31 dec 2019 day', () => {
            expect(periods[364]).toMatchObject({
                startDate: '2019-12-31',
                endDate: '2019-12-31',
                iso: '20191231',
                id: '20191231',
            })

            expect(periods[364].name).toEqual('2019-12-31')
        })
    })

    describe('Weekly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('WEEKLY')

            periods = option.getPeriods({
                offset: 2009 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of weeks in 2009', () => {
            expect(periods.length).toEqual(53)
        })

        it('should return the correct object for week 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2008-12-29',
                endDate: '2009-01-04',
                iso: '2009W1',
                id: '2009W1',
            })
            expect(periods[0].name).toEqual('Week 1 - 2008-12-29 - 2009-01-04')
        })

        it('should return the correct object for week 53', () => {
            expect(periods[52]).toMatchObject({
                startDate: '2009-12-28',
                endDate: '2010-01-03',
                iso: '2009W53',
                id: '2009W53',
            })
            expect(periods[52].name).toEqual(
                'Week 53 - 2009-12-28 - 2010-01-03'
            )
        })

        describe('-> Weekly Wednesday', () => {
            beforeAll(() => {
                const option = getFixedPeriodsOptionsById('WEEKLYWED')

                periods = option.getPeriods({
                    offset: 2019 - new Date(Date.now()).getFullYear(),
                    filterFuturePeriods: false,
                    reversePeriods: false,
                })
            })

            it('should return the correct number of weekly wednesday in 2019', () => {
                expect(periods.length).toEqual(52)
            })

            it('should return the correct object for weekly wednesday 27', () => {
                expect(periods[26]).toMatchObject({
                    startDate: '2019-07-03',
                    endDate: '2019-07-09',
                    iso: '2019WedW27',
                    id: '2019WedW27',
                })
                expect(periods[26].name).toEqual(
                    'Week 27 - 2019-07-03 - 2019-07-09'
                )
            })
        })

        describe('-> Weekly Thursday', () => {
            beforeAll(() => {
                const option = getFixedPeriodsOptionsById('WEEKLYTHU')

                periods = option.getPeriods({
                    offset: 2019 - new Date(Date.now()).getFullYear(),
                    filterFuturePeriods: false,
                    reversePeriods: false,
                })
            })

            it('should return the correct number of weekly thursday in 2019', () => {
                expect(periods.length).toEqual(52)
            })

            it('should return the correct object for weekly thursday 27', () => {
                expect(periods[26]).toMatchObject({
                    startDate: '2019-07-04',
                    endDate: '2019-07-10',
                    iso: '2019ThuW27',
                    id: '2019ThuW27',
                })
                expect(periods[26].name).toEqual(
                    'Week 27 - 2019-07-04 - 2019-07-10'
                )
            })
        })

        describe('-> Weekly Saturday', () => {
            beforeAll(() => {
                const option = getFixedPeriodsOptionsById('WEEKLYSAT')

                periods = option.getPeriods({
                    offset: 2019 - new Date(Date.now()).getFullYear(),
                    filterFuturePeriods: false,
                    reversePeriods: false,
                })
            })

            it('should return the correct number of weekly saturdays in 2019', () => {
                expect(periods.length).toEqual(53)
            })

            it('should return the correct object for weekly saturday 10', () => {
                expect(periods[9]).toMatchObject({
                    startDate: '2019-03-02',
                    endDate: '2019-03-08',
                    iso: '2019SatW10',
                    id: '2019SatW10',
                })

                expect(periods[9].name).toEqual(
                    'Week 10 - 2019-03-02 - 2019-03-08'
                )
            })
        })

        describe('-> Weekly Sunday', () => {
            beforeAll(() => {
                const option = getFixedPeriodsOptionsById('WEEKLYSUN')

                periods = option.getPeriods({
                    offset: 2019 - new Date(Date.now()).getFullYear(),
                    filterFuturePeriods: false,
                    reversePeriods: false,
                })
            })

            it('should return the correct number of weekly sundays in 2019', () => {
                expect(periods.length).toEqual(52)
            })

            it('should return the correct object for weekly sunday 10', () => {
                expect(periods[10]).toMatchObject({
                    startDate: '2019-03-10',
                    endDate: '2019-03-16',
                    iso: '2019SunW11',
                    id: '2019SunW11',
                })
                expect(periods[10].name).toEqual(
                    'Week 11 - 2019-03-10 - 2019-03-16'
                )
            })
        })
    })

    describe('Bi-weekly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('BIWEEKLY')

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of bi-weeks in 2019', () => {
            expect(periods.length).toEqual(26)
        })

        it('should return the correct object for bi-week 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2018-12-31',
                endDate: '2019-01-13',
                iso: '2019BiW1',
                id: '2019BiW1',
            })
            expect(periods[0].name).toEqual(
                'Bi-Week 1 - 2018-12-31 - 2019-01-13'
            )
        })

        it('should return the correct object for bi-week 26', () => {
            expect(periods[25]).toMatchObject({
                startDate: '2019-12-16',
                endDate: '2019-12-29',
                iso: '2019BiW26',
                id: '2019BiW26',
            })
            expect(periods[25].name).toEqual(
                'Bi-Week 26 - 2019-12-16 - 2019-12-29'
            )
        })
    })

    describe('Monthly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('MONTHLY')

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of months in 2019', () => {
            expect(periods.length).toEqual(12)
        })

        it('should return the correct object for month 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-01-31',
                iso: '201901',
                id: '201901',
            })
            expect(periods[0].name).toEqual('January 2019')
        })

        it('should return the correct object for month 12', () => {
            expect(periods[11]).toMatchObject({
                startDate: '2019-12-01',
                endDate: '2019-12-31',
                iso: '201912',
                id: '201912',
            })
            expect(periods[11].name).toEqual('December 2019')
        })
    })

    describe('Bi-Monthly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('BIMONTHLY')

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of bi-months in 2019', () => {
            expect(periods.length).toEqual(6)
        })

        it('should return the correct object for bi-month 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-02-28',
                iso: '201901B',
                id: '201901B',
            })
            expect(periods[0].name).toEqual('January - February 2019')
        })

        it('should return the correct object for bi-month 3', () => {
            expect(periods[2]).toMatchObject({
                startDate: '2019-05-01',
                endDate: '2019-06-30',
                iso: '201903B',
                id: '201903B',
            })
            expect(periods[2].name).toEqual('May - June 2019')
        })

        it('should return the correct object for bi-month 6', () => {
            expect(periods[5]).toMatchObject({
                startDate: '2019-11-01',
                endDate: '2019-12-31',
                iso: '201906B',
                id: '201906B',
            })
            expect(periods[5].name).toEqual('November - December 2019')
        })
    })

    describe('Quarterly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('QUARTERLY')

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of quarters in 2019', () => {
            expect(periods.length).toEqual(4)
        })

        it('should return the correct object for quarter 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-03-31',
                iso: '2019Q1',
                id: '2019Q1',
            })
            expect(periods[0].name).toEqual('January - March 2019')
        })

        it('should return the correct object for quarter 4', () => {
            expect(periods[3]).toMatchObject({
                startDate: '2019-10-01',
                endDate: '2019-12-31',
                iso: '2019Q4',
                id: '2019Q4',
            })
            expect(periods[3].name).toEqual('October - December 2019')
        })
    })

    describe('Six-monthly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('SIXMONTHLY')

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of six-month periods in 2019', () => {
            expect(periods.length).toEqual(2)
        })

        it('should return the correct object for six-monthly 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-01-01',
                endDate: '2019-06-30',
                iso: '2019S1',
                id: '2019S1',
            })
            expect(periods[0].name).toEqual('January - June 2019')
        })

        it('should return the correct object for six-monthly 2', () => {
            expect(periods[1]).toMatchObject({
                startDate: '2019-07-01',
                endDate: '2019-12-31',
                iso: '2019S2',
                id: '2019S2',
            })
            expect(periods[1].name).toEqual('July - December 2019')
        })
    })

    describe('Six-monthly April period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('SIXMONTHLYAPR')

            periods = option.getPeriods({
                offset: 2019 - new Date(Date.now()).getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of six-monthly April periods in 2019', () => {
            expect(periods.length).toEqual(2)
        })

        it('should return the correct object for six-monthly April 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-04-01',
                endDate: '2019-09-30',
                iso: '2019AprilS1',
                id: '2019AprilS1',
            })
            expect(periods[0].name).toEqual('April - September 2019')
        })

        it('should return the correct object for six-monthly April 2', () => {
            expect(periods[1]).toMatchObject({
                startDate: '2019-10-01',
                endDate: '2020-03-31',
                iso: '2019AprilS2',
                id: '2019AprilS2',
            })
            expect(periods[1].name).toEqual('October 2019 - March 2020')
        })
    })

    describe('Yearly period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('YEARLY')

            periods = option.getPeriods({
                offset: 10, // 2020 - 2029
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of yearly periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for yearly period 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2020-01-01',
                endDate: '2020-12-31',
                iso: '2020',
                id: '2020',
            })
            expect(periods[0].name).toEqual('2020')
        })

        it('should return the correct object for yearly period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2029-01-01',
                endDate: '2029-12-31',
                iso: '2029',
                id: '2029',
            })
            expect(periods[9].name).toEqual('2029')
        })
    })

    describe('Financial November period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('FYNOV')

            periods = option.getPeriods({
                offset: 9,
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of financial November periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for financial November period 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-11-01',
                endDate: '2020-10-31',
                id: '2019Nov',
            })
            expect(periods[0].name).toEqual('November 2019 - October 2020')
        })

        it('should return the correct object for financial November period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2028-11-01',
                endDate: '2029-10-31',
                id: '2028Nov',
            })
            expect(periods[9].name).toEqual('November 2028 - October 2029')
        })
    })

    describe('Financial October period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('FYOCT')

            periods = option.getPeriods({
                offset: 9,
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of financial October periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for financial October period 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-10-01',
                endDate: '2020-09-30',
                id: '2019Oct',
            })
            expect(periods[0].name).toEqual('October 2019 - September 2020')
        })

        it('should return the correct object for financial October period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2028-10-01',
                endDate: '2029-09-30',
                id: '2028Oct',
            })
            expect(periods[9].name).toEqual('October 2028 - September 2029')
        })
    })

    describe('Financial July period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('FYJUL')

            periods = option.getPeriods({
                offset: 9,
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of financial July periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for financial July 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-07-01',
                endDate: '2020-06-30',
                id: '2019July',
            })
            expect(periods[0].name).toEqual('July 2019 - June 2020')
        })

        it('should return the correct object for financial July period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2028-07-01',
                endDate: '2029-06-30',
                id: '2028July',
            })
            expect(periods[9].name).toEqual('July 2028 - June 2029')
        })
    })

    describe('Financial April period generator', () => {
        let periods

        beforeAll(() => {
            const option = getFixedPeriodsOptionsById('FYAPR')

            periods = option.getPeriods({
                offset: 9,
                filterFuturePeriods: false,
                reversePeriods: false,
            })
        })

        it('should return the correct number of financial April periods', () => {
            expect(periods.length).toEqual(10)
        })

        it('should return the correct object for financial April 1', () => {
            expect(periods[0]).toMatchObject({
                startDate: '2019-04-01',
                endDate: '2020-03-31',
                id: '2019April',
            })
            expect(periods[0].name).toEqual('April 2019 - March 2020')
        })

        it('should return the correct object for financial April period 10', () => {
            expect(periods[9]).toMatchObject({
                startDate: '2028-04-01',
                endDate: '2029-03-31',
                id: '2028April',
            })
            expect(periods[9].name).toEqual('April 2028 - March 2029')
        })
    })

    describe('Year offset from now helper', () => {
        it('should process future offsets correctly', () => {
            expect(getYearOffsetFromNow('2025')).toEqual(6)
        })
        it('should process past offsets correctly', () => {
            expect(getYearOffsetFromNow('2014')).toEqual(-5)
        })
    })

    describe('Period code parser', () => {
        it('should parse daily periods correctly', () => {
            const period = parsePeriodCode('20140101')
            expect(period.id).toEqual('DAILY')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly periods correctly', () => {
            const period = parsePeriodCode('2014W9')
            expect(period.id).toEqual('WEEKLY')
            expect(period).toMatchSnapshot()
        })

        it('should parse bi-weekly periods correctly', () => {
            const period = parsePeriodCode('2014BiW9')
            expect(period.id).toEqual('BIWEEKLY')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-wednessday periods correctly', () => {
            const period = parsePeriodCode('2014WedW9')
            expect(period.id).toEqual('WEEKLYWED')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-thursday periods correctly', () => {
            const period = parsePeriodCode('2014ThuW9')
            expect(period.id).toEqual('WEEKLYTHU')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-saturday periods correctly', () => {
            const period = parsePeriodCode('2014SatW9')
            expect(period.id).toEqual('WEEKLYSAT')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-sunday periods correctly', () => {
            const period = parsePeriodCode('2014SunW9')
            expect(period.id).toEqual('WEEKLYSUN')
            expect(period).toMatchSnapshot()
        })

        it('should parse weekly-sunday periods correctly', () => {
            const period = parsePeriodCode('2014SunW9')
            expect(period.id).toEqual('WEEKLYSUN')
            expect(period).toMatchSnapshot()
        })

        it('should parse monthly periods correctly', () => {
            const period = parsePeriodCode('201406')
            expect(period.id).toEqual('MONTHLY')
            expect(period).toMatchSnapshot()
        })

        it('should parse bimonthly periods correctly', () => {
            const period = parsePeriodCode('201406B')
            expect(period.id).toEqual('BIMONTHLY')
            expect(period).toMatchSnapshot()
        })

        it('should parse quarterly periods correctly', () => {
            const period = parsePeriodCode('2014Q1')
            expect(period.id).toEqual('QUARTERLY')
            expect(period).toMatchSnapshot()
        })

        it('should parse six-monthly periods correctly', () => {
            const period = parsePeriodCode('2014S1')
            expect(period.id).toEqual('SIXMONTHLY')
            expect(period).toMatchSnapshot()
        })

        it('should parse six-monthly-april periods correctly', () => {
            const period = parsePeriodCode('2014AprilS1')
            expect(period.id).toEqual('SIXMONTHLYAPR')
            expect(period).toMatchSnapshot()
        })

        it('should parse yearly periods correctly', () => {
            const period = parsePeriodCode('2014')
            expect(period.id).toEqual('YEARLY')
            expect(period).toMatchSnapshot()
        })

        it('should parse financial-year-november periods correctly', () => {
            const period = parsePeriodCode('2014Nov')
            expect(period.id).toEqual('FYNOV')
            expect(period).toMatchSnapshot()
        })

        it('should parse financial-year-october periods correctly', () => {
            const period = parsePeriodCode('2014Oct')
            expect(period.id).toEqual('FYOCT')
            expect(period).toMatchSnapshot()
        })

        it('should parse financial-year-july periods correctly', () => {
            const period = parsePeriodCode('2014July')
            expect(period.id).toEqual('FYJUL')
            expect(period).toMatchSnapshot()
        })

        it('should parse financial-year-april periods correctly', () => {
            const period = parsePeriodCode('2014April')
            expect(period.id).toEqual('FYAPR')
            expect(period).toMatchSnapshot()
        })
    })
})
