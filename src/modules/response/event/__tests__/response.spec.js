import responseBooleanHideNa from '../../../../__demo__/data/event/boolean.data.hidena.json'
import responseBoolean from '../../../../__demo__/data/event/boolean.data.json'
import responseBooleanOrg from '../../../../__demo__/data/event/boolean.data.org.json'
import responseDateHideNa from '../../../../__demo__/data/event/date.data.hidena.json'
import responseDate from '../../../../__demo__/data/event/date.data.json'
import responseDateOrg from '../../../../__demo__/data/event/date.data.org.json'
import responseDatetimeHideNa from '../../../../__demo__/data/event/datetime.data.hidena.json'
import responseDatetime from '../../../../__demo__/data/event/datetime.data.json'
import responseDatetimeOrg from '../../../../__demo__/data/event/datetime.data.org.json'
import responseTextHideNa from '../../../../__demo__/data/event/email.data.hidena.json'
import responseText from '../../../../__demo__/data/event/email.data.json'
import responseTextOrg from '../../../../__demo__/data/event/email.data.org.json'
import responseEventstatusHideNa from '../../../../__demo__/data/event/eventstatus.data.hidena.json'
import responseEventstatus from '../../../../__demo__/data/event/eventstatus.data.json'
import responseEventstatusOrg from '../../../../__demo__/data/event/eventstatus.data.org.json'
import responseNumericHideNa from '../../../../__demo__/data/event/integer.data.hidena.json'
import responseNumeric from '../../../../__demo__/data/event/integer.data.json'
import responseNumericOrg from '../../../../__demo__/data/event/integer.data.org.json'
import responseOptionSetHideNa from '../../../../__demo__/data/event/optionset.data.hidena.json'
import responseOptionSet from '../../../../__demo__/data/event/optionset.data.json'
import responseOptionSetOrg from '../../../../__demo__/data/event/optionset.data.org.json'
import responseTimeHideNa from '../../../../__demo__/data/event/time.data.hidena.json'
import responseTime from '../../../../__demo__/data/event/time.data.json'
import responseTimeOrg from '../../../../__demo__/data/event/time.data.org.json'
import responseYesOnlyHideNa from '../../../../__demo__/data/event/yesonly.data.hidena.json'
import responseYesOnly from '../../../../__demo__/data/event/yesonly.data.json'
import responseYesOnlyOrg from '../../../../__demo__/data/event/yesonly.data.org.json'
import {
    VALUE_TYPE_AGE,
    VALUE_TYPE_BOOLEAN,
    VALUE_TYPE_DATE,
    VALUE_TYPE_DATETIME,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_TRUE_ONLY,
} from '../../../valueTypes.js'
import { getItemFormatterByHeaderName, getItemFormatterByValueType, transformResponse } from '../response.js'

describe('response', () => {
    describe('getItemFormatterByHeaderName', () => {
        it('should return the correct formatter and format correctly', () => {
            expect(getItemFormatterByHeaderName('eventstatus')('ACTIVE')).toBe('Active')
            expect(getItemFormatterByHeaderName('eventstatus')('COMPLETED')).toBe('Completed')
            expect(getItemFormatterByHeaderName('eventstatus')('SCHEDULE')).toBe('Scheduled')
            expect(getItemFormatterByHeaderName('programstatus')('ACTIVE')).toBe('Active')
            expect(getItemFormatterByHeaderName('programstatus')('COMPLETED')).toBe('Completed')
            expect(getItemFormatterByHeaderName('programstatus')('CANCELLED')).toBe('Cancelled')
        })
    })

    describe('getItemFormatterByValueType', () => {
        it('should return the correct formatter and format correctly', () => {
            expect(getItemFormatterByValueType(VALUE_TYPE_BOOLEAN)('1')).toBe(
                'Yes'
            )
            expect(getItemFormatterByValueType(VALUE_TYPE_BOOLEAN)('0')).toBe(
                'No'
            )
            expect(getItemFormatterByValueType(VALUE_TYPE_TRUE_ONLY)('1')).toBe(
                'Yes'
            )
            expect(
                getItemFormatterByValueType(VALUE_TYPE_AGE)(
                    '1985-01-01 00:00:00.0'
                )
            ).toBe('1985-01-01')
            expect(
                getItemFormatterByValueType(VALUE_TYPE_DATE)(
                    '2023-01-01 00:00:00.0'
                )
            ).toBe('2023-01-01')
            expect(
                getItemFormatterByValueType(VALUE_TYPE_DATETIME)(
                    '2023-01-01 12:00:00.0'
                )
            ).toBe('2023-01-01 12:00')
            expect(
                getItemFormatterByValueType(VALUE_TYPE_PERCENTAGE)('50.0')
            ).toBe('50')
            expect(getItemFormatterByValueType('NOT_A_TYPE')).toBe(undefined)
        })
    })

    describe('transformResponse', () => {
        describe('boolean', () => {
            it('transforms response', () => {
                expect(transformResponse(responseBooleanOrg)).toEqual(
                    responseBoolean
                )
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseBooleanOrg, {
                        hideNaData: true,
                    })
                ).toEqual(responseBooleanHideNa)
            })
        })

        describe('date', () => {
            it('transforms response', () => {
                expect(transformResponse(responseDateOrg)).toEqual(responseDate)
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseDateOrg, { hideNaData: true })
                ).toEqual(responseDateHideNa)
            })
        })

        describe('datetime', () => {
            it('transforms response', () => {
                expect(transformResponse(responseDatetimeOrg)).toEqual(
                    responseDatetime
                )
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseDatetimeOrg, { hideNaData: true })
                ).toEqual(responseDatetimeHideNa)
            })
        })

        describe('numeric', () => {
            it('transforms response', () => {
                expect(transformResponse(responseNumericOrg)).toEqual(
                    responseNumeric
                )
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseNumericOrg, { hideNaData: true })
                ).toEqual(responseNumericHideNa)
            })
        })

        describe('option set', () => {
            it('transforms response with non-unique codes across two option sets', () => {
                expect(transformResponse(responseOptionSetOrg)).toEqual(
                    responseOptionSet
                )
            })

            it('transforms response with non-unique codes across two option sets and hides N/A data', () => {
                expect(
                    transformResponse(responseOptionSetOrg, {
                        hideNaData: true,
                    })
                ).toEqual(responseOptionSetHideNa)
            })
        })

        describe('text', () => {
            it('transforms response', () => {
                expect(transformResponse(responseTextOrg)).toEqual(responseText)
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseTextOrg, { hideNaData: true })
                ).toEqual(responseTextHideNa)
            })
        })

        describe('time', () => {
            it('transforms response', () => {
                expect(transformResponse(responseTimeOrg)).toEqual(responseTime)
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseTimeOrg, { hideNaData: true })
                ).toEqual(responseTimeHideNa)
            })
        })

        describe('yes only', () => {
            it('transforms response', () => {
                expect(transformResponse(responseYesOnlyOrg)).toEqual(
                    responseYesOnly
                )
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseYesOnlyOrg, {
                        hideNaData: true,
                    })
                ).toEqual(responseYesOnlyHideNa)
            })
        })

        describe('eventstatus', () => {
            it('transforms response', () => {
                expect(transformResponse(responseEventstatusOrg)).toEqual(responseEventstatus)
            })

            it('transforms response and hides N/A data', () => {
                expect(
                    transformResponse(responseEventstatusOrg, { hideNaData: true })
                ).toEqual(responseEventstatusHideNa)
            })
        })
    })
})
