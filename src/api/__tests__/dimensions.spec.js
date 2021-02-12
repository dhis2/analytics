import {
    ALL_ID,
    DATA_ELEMENTS,
    DATA_SETS,
    DETAIL,
    EVENT_DATA_ITEMS,
    INDICATORS,
    PROGRAM_INDICATORS,
} from '../../modules/dataTypes'
import {
    dimensionsQuery,
    indicatorGroupsQuery,
    dataElementGroupsQuery,
    programsQuery,
    indicatorsQuery,
    dataSetsQuery,
    dataElementsQuery,
    dataElementOperandsQuery,
    apiFetchGroups,
    apiFetchDimensions,
    apiFetchOptions,
} from '../dimensions'

let mockDataEngine
let mockQueryFn
let queryVariables
let fetchFnArgs

const asyncCheckMatches = (
    [queryDefinition, queryVariables, callCount = 1, callIndex = 0],
    done
) => {
    setTimeout(() => {
        expect(mockQueryFn).toHaveBeenCalledTimes(callCount)
        expect(mockQueryFn.mock.calls[callIndex][0]).toEqual(queryDefinition)
        expect(mockQueryFn.mock.calls[callIndex][1].variables).toEqual(
            queryVariables
        )

        done()
    })
}

describe('api: dimensions', () => {
    beforeEach(() => {
        mockQueryFn = jest.fn().mockResolvedValue({
            dimensions: { dimensions: [] },
            indicatorGroups: { indicatorGroups: [] },
            dataElementGroups: { dataElementGroups: [] },
            programs: { pager: {}, programs: [] },
            indicators: { pager: {}, indicators: [] },
            dataElements: { pager: {}, dataElements: [] },
            dataElementOperands: { pager: {}, dataElementOperands: [] },
            dataSets: { pager: {}, dataSets: [] },
            programIndicators: { pager: {}, programIndicators: [] },
            programDataElements: {
                pager: {},
                programDataElements: [],
            },
            trackedEntityAttributes: { trackedEntityAttributes: [] },
        })
        mockDataEngine = { query: mockQueryFn }
    })

    describe('apiFetchDimensions', () => {
        it('has correct entity and name property', done => {
            apiFetchDimensions(mockDataEngine, 'entireName')

            asyncCheckMatches(
                [{ dimensions: dimensionsQuery }, { nameProp: 'entireName' }],
                done
            )
        })
    })

    describe('apiFetchGroups', () => {
        it('has correct endpoint, name prop, and page value for indicators', done => {
            apiFetchGroups(mockDataEngine, INDICATORS, 'entireName')

            asyncCheckMatches(
                [
                    { indicatorGroups: indicatorGroupsQuery },
                    { nameProp: 'displayName' },
                ],
                done
            )
        })

        it('has correct name prop for dataElements', done => {
            apiFetchGroups(mockDataEngine, DATA_ELEMENTS, 'entireName')

            asyncCheckMatches(
                [
                    { dataElementGroups: dataElementGroupsQuery },
                    { nameProp: 'entireName' },
                ],
                done
            )
        })

        it('has correct name prop for eventDataItems', done => {
            apiFetchGroups(mockDataEngine, EVENT_DATA_ITEMS, 'entireName')

            asyncCheckMatches(
                [{ programs: programsQuery }, { nameProp: 'entireName' }],
                done
            )
        })

        it('has correct name prop for programIndicators', done => {
            apiFetchGroups(mockDataEngine, PROGRAM_INDICATORS, 'entireName')

            asyncCheckMatches(
                [{ programs: programsQuery }, { nameProp: 'entireName' }],
                done
            )
        })

        it('has correct name prop for dataSets', done => {
            apiFetchGroups(mockDataEngine, DATA_SETS, 'entireName')

            asyncCheckMatches(
                [{ data: dataSetsQuery }, { nameProp: 'entireName' }],
                done
            )
        })
    })

    describe('apiFetchOptions', () => {
        beforeEach(() => {
            queryVariables = {
                nameProp: 'entireName',
                filter: { group: ALL_ID },
                page: 1,
                searchTerm: '',
            }

            fetchFnArgs = {
                dataEngine: mockDataEngine,
                ...queryVariables,
            }
        })

        describe('indicators url', () => {
            beforeEach(() => {
                fetchFnArgs.filter.dataType = INDICATORS
            })

            it('has correct name, filter and page value', done => {
                apiFetchOptions(fetchFnArgs)

                asyncCheckMatches(
                    [{ indicators: indicatorsQuery }, { ...queryVariables }],
                    done
                )
            })

            it('has correct filter text value', done => {
                queryVariables.searchTerm = 'rarity'

                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [{ indicators: indicatorsQuery }, { ...queryVariables }],
                    done
                )
            })

            it('has correct filter based on group Id', done => {
                queryVariables.filter.group = 'rarity'

                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [{ indicators: indicatorsQuery }, { ...queryVariables }],
                    done
                )
            })
        })

        describe('dataElements url', () => {
            beforeEach(() => {
                fetchFnArgs.filter.dataType = DATA_ELEMENTS
            })

            describe('totals', () => {
                it('has correct fields, filter, and page', done => {
                    apiFetchOptions(fetchFnArgs)

                    asyncCheckMatches(
                        [{ dataElements: dataElementsQuery }, queryVariables],
                        done
                    )
                })

                it('has correct filter text value', done => {
                    queryVariables.searchTerm = 'rarity'

                    apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [{ dataElements: dataElementsQuery }, queryVariables],
                        done
                    )
                })

                it('has correct filter based on group Id', done => {
                    queryVariables.filter.group = 'rarity'

                    apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [{ dataElements: dataElementsQuery }, queryVariables],
                        done
                    )
                })
            })

            describe('details', () => {
                beforeEach(() => {
                    fetchFnArgs.filter.subGroup = DETAIL
                })

                it('has correct fields, filter, and page', done => {
                    apiFetchOptions(fetchFnArgs)

                    asyncCheckMatches(
                        [
                            { dataElementOperands: dataElementOperandsQuery },
                            queryVariables,
                        ],
                        done
                    )
                })

                it('has correct filter text value', done => {
                    queryVariables.searchTerm = 'rarity'

                    apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [
                            { dataElementOperands: dataElementOperandsQuery },
                            queryVariables,
                        ],
                        done
                    )
                })

                it('has correct filter based on group Id', done => {
                    queryVariables.filter.group = 'rarity'

                    apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [
                            { dataElementOperands: dataElementOperandsQuery },
                            queryVariables,
                        ],
                        done
                    )
                })

                it('has correct url params for searchTerm and group Id', done => {
                    queryVariables.searchTerm = 'rarity'
                    queryVariables.filter.group = 'rainbow'

                    apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [
                            { dataElementOperands: dataElementOperandsQuery },
                            queryVariables,
                        ],
                        done
                    )
                })
            })
        })

        describe('dataSets url', () => {
            beforeEach(() => {
                delete queryVariables.filter.group
                fetchFnArgs.filter.dataType = DATA_SETS
            })

            it('has correct fields, filter, and page', done => {
                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [{ dataSets: dataSetsQuery }, queryVariables],
                    done
                )
            })

            it('has correct filter text value', done => {
                queryVariables.searchTerm = 'rarity'

                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [{ dataSets: dataSetsQuery }, queryVariables],
                    done
                )
            })
        })

        describe('eventDataItems', () => {
            beforeEach(() => {
                fetchFnArgs.filter.dataType = EVENT_DATA_ITEMS
            })

            it('has correct fields, filter, and page (data elements) in request', done => {
                queryVariables.filter.group = 'rainbowdash'

                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [
                        { programDataElements: programDataElementsQuery },
                        queryVariables,
                        2,
                    ],
                    done
                )
            })

            it('has correct filter text value in request url', done => {
                queryVariables.searchTerm = 'rarity'

                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [
                        { programDataElements: programDataElementsQuery },
                        queryVariables,
                        2,
                    ],
                    done
                )
            })

            it('has correct fields and filter (attributes) in request url', done => {
                queryVariables.filter.group = 'rainbowdash'
                delete queryVariables.page

                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [
                        {
                            trackedEntityAttributes: trackedEntityAttributesQuery,
                        },
                        {
                            ...queryVariables,
                            id: queryVariables.filter.group,
                            groupId: undefined, //FIXME: remove this line?
                        },
                        2,
                        1,
                    ],
                    done
                )
            })
        })

        describe('programIndicators url', () => {
            beforeEach(() => {
                fetchFnArgs.filter.dataType = PROGRAM_INDICATORS
            })

            it('has correct fields, filter, and page', done => {
                queryVariables.filter.group = 'rainbowdash'

                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [
                        { programIndicators: programIndicatorsQuery },
                        queryVariables,
                    ],
                    done
                )
            })

            it('has correct filter text value', done => {
                queryVariables.searchTerm = 'rarity'

                apiFetchOptions({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [
                        { programIndicators: programIndicatorsQuery },
                        queryVariables,
                    ],
                    done
                )
            })
        })
    })
})
