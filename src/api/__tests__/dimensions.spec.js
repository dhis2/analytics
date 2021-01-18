import {
    dimensionsQuery,
    indicatorGroupsQuery,
    dataElementGroupsQuery,
    programsQuery,
    indicatorsQuery,
    dataSetsQuery,
    dataElementsQuery,
    dataElementOperandsQuery,
    programIndicatorsQuery,
    programDataElementsQuery,
    trackedEntityAttributesQuery,
    apiFetchAlternatives,
    apiFetchGroups,
    apiFetchDimensions,
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
            apiFetchGroups(mockDataEngine, 'indicators', 'entireName')

            asyncCheckMatches(
                [
                    { indicatorGroups: indicatorGroupsQuery },
                    { nameProp: 'displayName' },
                ],
                done
            )
        })

        it('has correct name prop for dataElements', done => {
            apiFetchGroups(mockDataEngine, 'dataElements', 'entireName')

            asyncCheckMatches(
                [
                    { dataElementGroups: dataElementGroupsQuery },
                    { nameProp: 'entireName' },
                ],
                done
            )
        })

        it('has correct name prop for eventDataItems', done => {
            apiFetchGroups(mockDataEngine, 'eventDataItems', 'entireName')

            asyncCheckMatches(
                [{ programs: programsQuery }, { nameProp: 'entireName' }],
                done
            )
        })

        it('has correct name prop for programIndicators', done => {
            apiFetchGroups(mockDataEngine, 'programIndicators', 'entireName')

            asyncCheckMatches(
                [{ programs: programsQuery }, { nameProp: 'entireName' }],
                done
            )
        })

        it('does not make an api request for dataSets', done => {
            apiFetchGroups(mockDataEngine, 'dataSets')

            setTimeout(() => {
                expect(mockQueryFn).not.toHaveBeenCalled()
                done()
            })
        })
    })

    describe('apiFetchAlternatives', () => {
        beforeEach(() => {
            queryVariables = {
                nameProp: 'entireName',
                groupId: 'ALL',
                page: 1,
                filterText: '',
            }

            fetchFnArgs = {
                dataEngine: mockDataEngine,
                dataType: '',
                groupDetail: '',
                ...queryVariables,
            }
        })

        describe('indicators url', () => {
            beforeEach(() => {
                fetchFnArgs.dataType = 'indicators'
            })

            it('has correct name, filter and page value', done => {
                apiFetchAlternatives(fetchFnArgs)

                asyncCheckMatches(
                    [{ indicators: indicatorsQuery }, queryVariables],
                    done
                )
            })

            it('has correct filter text value', done => {
                queryVariables.filterText = 'rarity'

                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [{ indicators: indicatorsQuery }, queryVariables],
                    done
                )
            })

            it('has correct filter based on group Id', done => {
                queryVariables.groupId = 'rarity'

                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [{ indicators: indicatorsQuery }, queryVariables],
                    done
                )
            })
        })

        describe('dataElements url', () => {
            beforeEach(() => {
                fetchFnArgs.dataType = 'dataElements'
            })

            describe('totals', () => {
                it('has correct fields, filter, and page', done => {
                    apiFetchAlternatives(fetchFnArgs)

                    asyncCheckMatches(
                        [{ dataElements: dataElementsQuery }, queryVariables],
                        done
                    )
                })

                it('has correct filter text value', done => {
                    queryVariables.filterText = 'rarity'

                    apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [{ dataElements: dataElementsQuery }, queryVariables],
                        done
                    )
                })

                it('has correct filter based on group Id', done => {
                    queryVariables.groupId = 'rarity'

                    apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [{ dataElements: dataElementsQuery }, queryVariables],
                        done
                    )
                })
            })

            describe('details', () => {
                beforeEach(() => {
                    fetchFnArgs.groupDetail = 'detail'
                })

                it('has correct fields, filter, and page', done => {
                    apiFetchAlternatives(fetchFnArgs)

                    asyncCheckMatches(
                        [
                            { dataElementOperands: dataElementOperandsQuery },
                            queryVariables,
                        ],
                        done
                    )
                })

                it('has correct filter text value', done => {
                    queryVariables.filterText = 'rarity'

                    apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [
                            { dataElementOperands: dataElementOperandsQuery },
                            queryVariables,
                        ],
                        done
                    )
                })

                it('has correct filter based on group Id', done => {
                    queryVariables.groupId = 'rarity'

                    apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                    asyncCheckMatches(
                        [
                            { dataElementOperands: dataElementOperandsQuery },
                            queryVariables,
                        ],
                        done
                    )
                })

                it('has correct url params for filterText and group Id', done => {
                    queryVariables.filterText = 'rarity'
                    queryVariables.groupId = 'rainbow'

                    apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

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
                delete queryVariables.groupId
                fetchFnArgs.dataType = 'dataSets'
            })

            it('has correct fields, filter, and page', done => {
                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [{ dataSets: dataSetsQuery }, queryVariables],
                    done
                )
            })

            it('has correct filter text value', done => {
                queryVariables.filterText = 'rarity'

                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [{ dataSets: dataSetsQuery }, queryVariables],
                    done
                )
            })
        })

        describe('eventDataItems', () => {
            beforeEach(() => {
                fetchFnArgs.dataType = 'eventDataItems'
            })

            it('has correct fields, filter, and page (data elements) in request', done => {
                queryVariables.groupId = 'rainbowdash'

                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

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
                queryVariables.filterText = 'rarity'

                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

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
                queryVariables.groupId = 'rainbowdash'
                delete queryVariables.page

                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [
                        {
                            trackedEntityAttributes: trackedEntityAttributesQuery,
                        },
                        {
                            ...queryVariables,
                            id: queryVariables.groupId,
                            groupId: undefined,
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
                fetchFnArgs.dataType = 'programIndicators'
            })

            it('has correct fields, filter, and page', done => {
                queryVariables.groupId = 'rainbowdash'

                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

                asyncCheckMatches(
                    [
                        { programIndicators: programIndicatorsQuery },
                        queryVariables,
                    ],
                    done
                )
            })

            it('has correct filter text value', done => {
                queryVariables.filterText = 'rarity'

                apiFetchAlternatives({ ...fetchFnArgs, ...queryVariables })

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
