import { renderHook, act, waitFor } from '@testing-library/react'
import PropTypes from 'prop-types'
import React from 'react'
import * as mockData from '../../../../__fixtures__/interpretationsMockData.js'
import {
    useInterpretationsList,
    useActiveInterpretation,
    useInterpretation,
    useLike,
    useInterpretationsCurrentUser,
    useCreateInterpretation,
    useDeleteInterpretation,
    useUpdateInterpretationText,
    useAddCommentToActiveInterpretation,
    useDeleteCommentFromActiveInterpretation,
    useUpdateCommentForActiveInterpretation,
    useInterpretationAccess,
    useCommentAccess,
    useInterpretationsManager,
} from '../hooks.js'
import { InterpretationsProvider } from '../InterpretationsProvider.js'

const mockQuery = jest.fn()
const mockMutate = jest.fn()

// Mock the useDataEngine hook to return our mock
jest.mock('@dhis2/app-runtime', () => ({
    useDataEngine: () => ({
        ...jest.requireActual('@dhis2/app-runtime'),
        query: mockQuery,
        mutate: mockMutate,
    }),
}))

const createMockImplementation =
    (data, shouldError = false) =>
    () =>
        new Promise((resolve, reject) => {
            if (shouldError) {
                const msg = typeof data === 'string' ? data : 'OOPSIE'
                reject(new Error(msg))
            } else {
                resolve(data)
            }
        })

// Test wrapper component that properly pre-populates manager
const createWrapper = (initialInterpretations = []) => {
    const InterpretationsPopulator = ({ children }) => {
        const manager = useInterpretationsManager()
        if (
            initialInterpretations.length > 0 &&
            manager.interpretations.size === 0
        ) {
            manager.currentType = mockData.visualization.type
            manager.currentVisualizationId = mockData.visualization.id
            manager.resetInterpretations(initialInterpretations)
            manager.activeInterpretationId = initialInterpretations[0].id
        }
        return children
    }
    const TestWrapper = ({ children }) => {
        return (
            <InterpretationsProvider currentUser={mockData.currentUser}>
                <InterpretationsPopulator>{children}</InterpretationsPopulator>
            </InterpretationsProvider>
        )
    }
    const propTypes = { children: PropTypes.node }
    TestWrapper.propTypes = propTypes
    InterpretationsPopulator.propTypes = propTypes
    return TestWrapper
}

// Custom hook to test interpretation-focused hooks (with pre-populated manager)
const useAllHooks = (visualizationType, visualizationId, interpretationId) => {
    // Not used directly but useful here to test things like unsubscriptions etc
    const manager = useInterpretationsManager()
    // Core data hooks - no manual population needed since manager is pre-populated
    const currentUser = useInterpretationsCurrentUser()
    const interpretationsList = useInterpretationsList(
        visualizationType,
        visualizationId
    )
    const activeInterpretation = useActiveInterpretation(interpretationId)
    const interpretation = useInterpretation(interpretationId)

    // Like hook (includes mutation)
    const like = useLike(interpretationId)

    // Access hooks
    const interpretationAccess = useInterpretationAccess(interpretation)
    const commentAccess = useCommentAccess(
        mockData.interpretationDetails.comments[0],
        true
    ) // Mock comment access

    // Mutation hooks
    const [createInterpretation, createState] = useCreateInterpretation({
        type: visualizationType,
        id: visualizationId,
        text: 'New interpretation',
    })

    /* Note that we are NOT deleting the active interpretation but another one!
     * Some of the hooks used in the modal in in this test hook require the
     * presence of an active interpretation and will crash without it. This is
     * not a problem when the components are actually used int an app, because
     * the modal closes when the active interpretation is removed.  */
    const [deleteInterpretation, deleteState] = useDeleteInterpretation({
        id: mockData.interpretations[1].id,
    })

    const [updateInterpretationText, updateState] = useUpdateInterpretationText(
        {
            id: interpretationId,
            text: 'Updated text',
        }
    )

    const [addComment, addCommentState] = useAddCommentToActiveInterpretation({
        text: 'New comment',
    })

    const [deleteComment, deleteCommentState] =
        useDeleteCommentFromActiveInterpretation({
            id: 'commentid1',
        })

    const [updateComment, updateCommentState] =
        useUpdateCommentForActiveInterpretation({
            id: 'commentid1',
            text: 'Updated comment',
        })

    return {
        manager,
        // Data hooks
        currentUser,
        interpretationsList,
        activeInterpretation,
        interpretation,

        // Access hooks
        interpretationAccess,
        commentAccess,

        // Like is also a mutation but does not implement the useInterpretationsManagerMutation internally
        like,

        // Mutation hooks
        mutations: {
            createInterpretation,
            createState,
            deleteInterpretation,
            deleteState,
            updateInterpretationText,
            updateState,
            addComment,
            addCommentState,
            deleteComment,
            deleteCommentState,
            updateComment,
            updateCommentState,
        },
    }
}

/* Extracted to as function because it is reused by all other tests
 * apart from the list test */
const shouldLoadActiveInterpretation = async () => {
    mockQuery.mockImplementationOnce(
        createMockImplementation({
            interpretations: {
                interpretations: mockData.interpretations,
            },
        })
    )
    mockQuery.mockImplementationOnce(
        createMockImplementation({
            interpretation: mockData.interpretationDetails,
        })
    )

    const renderHookResult = renderHook(
        () =>
            useAllHooks(
                mockData.visualization.type,
                mockData.visualization.id,
                mockData.interpretationDetails.id
            ),
        { wrapper: createWrapper(mockData.interpretations) }
    )
    const { result } = renderHookResult

    expect(result.current.activeInterpretation.loading).toBe(true)
    expect(result.current.activeInterpretation.data).toBeUndefined()
    expect(result.current.activeInterpretation.error).toBeUndefined()

    await waitFor(() => {
        expect(result.current.activeInterpretation.loading).toBe(false)
        expect(result.current.activeInterpretation.error).toBeUndefined()
        expect(result.current.activeInterpretation.data).toEqual(
            mockData.interpretationDetails
        )
    })

    return renderHookResult
}

describe('Interpretations hooks integration tests', () => {
    beforeEach(() => {
        mockQuery.mockClear()
        mockMutate.mockClear()
    })

    describe('Listing interpretations', () => {
        test('should show loading state then load interpretations list successfully', async () => {
            mockQuery.mockImplementationOnce(
                createMockImplementation({
                    interpretations: {
                        interpretations: mockData.interpretations,
                    },
                })
            )
            const { result } = renderHook(
                () =>
                    useInterpretationsList(
                        mockData.visualization.type,
                        mockData.visualization.id
                    ),
                { wrapper: createWrapper() }
            )

            expect(result.current.loading).toBe(true)
            expect(result.current.data).toBeUndefined()
            expect(result.current.error).toBeUndefined()

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
                expect(result.current.data).toEqual(mockData.interpretations)
                expect(result.current.error).toBeUndefined()
            })
        })

        test('should handle interpretations list loading error', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})

            const errorMsg = 'Failed to load interpretations'
            try {
                mockQuery.mockImplementationOnce(
                    createMockImplementation(errorMsg, true)
                )

                const { result } = renderHook(
                    () =>
                        useInterpretationsList(
                            mockData.visualization.type,
                            mockData.visualization.id
                        ),
                    { wrapper: createWrapper() }
                )
                expect(result.current.loading).toBe(true)
                expect(result.current.data).toBeUndefined()
                expect(result.current.error).toBeUndefined()

                await waitFor(() => {
                    expect(result.current.loading).toBe(false)
                    expect(result.current.error).toEqual(new Error(errorMsg))
                    expect(result.current.data).toBeUndefined()
                })
            } finally {
                consoleErrorSpy.mockRestore()
            }
        })

        test('should reload when type/id changes', async () => {
            // First load with initial params
            mockQuery.mockImplementationOnce(
                createMockImplementation({
                    interpretations: {
                        interpretations: mockData.interpretations,
                    },
                })
            )

            const { result, rerender } = renderHook(
                ({ type, id }) => useInterpretationsList(type, id),
                {
                    wrapper: createWrapper(),
                    initialProps: {
                        type: mockData.visualization.type,
                        id: mockData.visualization.id,
                    },
                }
            )

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
                expect(result.current.data).toEqual(mockData.interpretations)
            })

            // Mock second call with empty result
            mockQuery.mockImplementationOnce(
                createMockImplementation({
                    interpretations: {
                        interpretations: [],
                    },
                })
            )

            // Change type/id to trigger reload
            rerender({
                type: 'TABLE',
                id: 'newViz456',
            })

            // Should show loading again
            expect(result.current.loading).toBe(true)

            await waitFor(() => {
                expect(result.current.loading).toBe(false)
                expect(result.current.data).toEqual([])
            })

            // Verify that mockQuery was called twice
            expect(mockQuery).toHaveBeenCalledTimes(2)
        })
    })

    describe('Loading active interpretation', () => {
        test('should load active interpretation', async () => {
            await shouldLoadActiveInterpretation()
        })
        test('should handle active interpretation loading error', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})
            const errorMsg = 'Failed to load interpretation details'

            try {
                mockQuery.mockImplementationOnce(
                    createMockImplementation({
                        interpretations: {
                            interpretations: mockData.interpretations,
                        },
                    })
                )
                mockQuery.mockImplementationOnce(
                    createMockImplementation(errorMsg, true)
                )

                const { result } = renderHook(
                    () =>
                        useAllHooks(
                            mockData.visualization.type,
                            mockData.visualization.id,
                            mockData.interpretationDetails.id
                        ),
                    { wrapper: createWrapper(mockData.interpretations) }
                )

                expect(result.current.activeInterpretation.loading).toBe(true)
                expect(result.current.activeInterpretation.data).toBeUndefined()
                expect(
                    result.current.activeInterpretation.error
                ).toBeUndefined()

                await waitFor(() => {
                    expect(result.current.activeInterpretation.loading).toBe(
                        false
                    )
                    expect(result.current.activeInterpretation.error).toEqual(
                        new Error(errorMsg)
                    )
                    expect(
                        result.current.activeInterpretation.data
                    ).toBeUndefined()
                })
            } finally {
                consoleErrorSpy.mockRestore()
            }
        })
        test('should reload when interpretation ID changes', async () => {
            // Mock first interpretation load
            mockQuery.mockImplementationOnce(
                createMockImplementation({
                    interpretations: {
                        interpretations: mockData.interpretations,
                    },
                })
            )
            mockQuery.mockImplementationOnce(
                createMockImplementation({
                    interpretation: mockData.interpretationDetails,
                })
            )

            const { result, rerender } = renderHook(
                ({ interpretationId }) =>
                    useAllHooks(
                        mockData.visualization.type,
                        mockData.visualization.id,
                        interpretationId
                    ),
                {
                    wrapper: createWrapper(mockData.interpretations),
                    initialProps: {
                        interpretationId: mockData.interpretationDetails.id,
                    },
                }
            )

            await waitFor(() => {
                expect(result.current.activeInterpretation.loading).toBe(false)
                expect(result.current.activeInterpretation.data).toEqual(
                    mockData.interpretationDetails
                )
            })

            // Mock second interpretation load
            const secondInterpretation = mockData.interpretations[1]
            mockQuery.mockImplementationOnce(
                createMockImplementation({
                    interpretation: secondInterpretation,
                })
            )

            // Change interpretation ID to trigger reload
            rerender({
                interpretationId: secondInterpretation.id,
            })

            // Should show loading again
            expect(result.current.activeInterpretation.loading).toBe(true)

            await waitFor(() => {
                expect(result.current.activeInterpretation.loading).toBe(false)
                expect(result.current.activeInterpretation.data).toEqual(
                    secondInterpretation
                )
            })

            // Verify that mockQuery was called for both interpretations
            expect(mockQuery).toHaveBeenCalledTimes(3) // 1 for list + 2 for interpretations
        })
    })

    describe('Interpretation subscription', () => {
        // Update behaviour is tested in the mutation hooks
        it('observers subscribe when mounting and unsubscribes when unmounting', async () => {
            const { result, unmount } = await shouldLoadActiveInterpretation()
            const manager = result.current.manager

            const initialObserversCount = manager.interpretationObservers.get(
                mockData.interpretationDetails.id
            ).size

            // useInterpretation (1), useActiveInterpretation(2)
            expect(initialObserversCount).toBe(2)
            expect(typeof manager.interpretationsListCallback).toBe('function')

            unmount()

            const newObserversCount = manager.interpretationObservers.get(
                mockData.interpretationDetails.id
            ).size

            expect(newObserversCount).toBe(0)
            expect(manager.interpretationsListCallback).toBe(null)
        })
    })

    describe('Access and current user hooks', () => {
        test('useInterpretationAccess returns a valid access result', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            expect(result.current.interpretationAccess).toEqual({
                comment: true,
                delete: true,
                edit: true,
                share: true,
            })
        })
        test('useCommentAccess returns a valid access result', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            expect(result.current.commentAccess).toEqual({
                delete: true,
                edit: true,
            })
        })
        test('useInterpretationsCurrentUser returns the current user', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            expect(result.current.currentUser).toEqual(mockData.currentUser)
        })
    })

    describe('Generic mutation behaviour', () => {
        /* The following hooks all simply call `useInterpretationsManagerMutation`
         * with a different `methodname`:
         * - useCreateInterpretation
         * - useUpdateInterpretationText
         * - useDeleteInterpretation
         * - useAddCommentToActiveInterpretation
         * - useUpdateCommentForActiveInterpretation
         * - useDeleteCommentFromActiveInterpretation
         * So we only have to test one to test the shared behaviour */
        it('can complete successfully after loading', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            mockMutate.mockImplementationOnce(createMockImplementation({}))

            expect(result.current.mutations.deleteState.loading).toBe(false)
            expect(result.current.mutations.deleteState.error).toBe(undefined)
            expect(result.current.mutations.deleteState.data).toBe(undefined)

            act(() => {
                result.current.mutations.deleteInterpretation()
            })

            await waitFor(() => {
                expect(result.current.mutations.deleteState.loading).toBe(true)
                expect(result.current.mutations.deleteState.error).toBe(
                    undefined
                )
                expect(result.current.mutations.deleteState.data).toBe(
                    undefined
                )
            })

            await waitFor(() => {
                expect(result.current.mutations.deleteState.loading).toBe(false)
                expect(result.current.mutations.deleteState.error).toBe(
                    undefined
                )
                expect(result.current.mutations.deleteState.data).toBe(null)
            })
        })
        it('can return an error after loading', async () => {
            const consoleErrorSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {})
            const errorMsg = 'Failed to delete interpretation'

            try {
                const { result } = await shouldLoadActiveInterpretation()
                mockMutate.mockImplementationOnce(
                    createMockImplementation(errorMsg, true)
                )

                expect(result.current.mutations.deleteState.loading).toBe(false)
                expect(result.current.mutations.deleteState.error).toBe(
                    undefined
                )
                expect(result.current.mutations.deleteState.data).toBe(
                    undefined
                )

                act(() => {
                    result.current.mutations.deleteInterpretation()
                })

                await waitFor(() => {
                    expect(result.current.mutations.deleteState.loading).toBe(
                        true
                    )
                    expect(result.current.mutations.deleteState.error).toBe(
                        undefined
                    )
                    expect(result.current.mutations.deleteState.data).toBe(
                        undefined
                    )
                })

                await waitFor(() => {
                    expect(result.current.mutations.deleteState.loading).toBe(
                        false
                    )
                    expect(result.current.mutations.deleteState.error).toEqual(
                        new Error(errorMsg)
                    )
                    expect(result.current.mutations.deleteState.data).toBe(
                        undefined
                    )
                })
            } finally {
                consoleErrorSpy.mockRestore()
            }
        })
    })

    describe('Like behaviour', () => {
        test('Interpretation like can be toggled', async () => {
            const { result } = await shouldLoadActiveInterpretation()

            expect(result.current.like.isLikedByCurrentUser).toBe(true)
            expect(result.current.like.toggleLikeInProgress).toBe(false)

            act(() => {
                result.current.like.toggleLike()
            })

            await waitFor(() => {
                expect(result.current.like.toggleLikeInProgress).toBe(true)
                expect(result.current.like.isLikedByCurrentUser).toBe(true)
            })

            await waitFor(() => {
                expect(result.current.like.toggleLikeInProgress).toBe(false)
                expect(result.current.like.isLikedByCurrentUser).toBe(false)
                // This is also reflected in the interpretation observers
                expect(result.current.interpretation.likes).toBe(0)
                expect(result.current.interpretation.likedBy).toEqual([])
                expect(result.current.activeInterpretation.data.likes).toBe(0)
                expect(
                    result.current.activeInterpretation.data.likedBy
                ).toEqual([])
                // But not in the list observer, because this component only needs
                // to be aware of IDs and not of item content
                expect(
                    result.current.interpretationsList.data[0].likes
                ).not.toBe(0)
                expect(
                    result.current.interpretationsList.data[0].likedBy
                ).not.toEqual([])
            })
        })
    })

    describe('State synchronization', () => {
        test('Creating an interpretation updates the list', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            mockMutate.mockImplementationOnce(createMockImplementation({}))
            mockQuery.mockImplementationOnce(
                createMockImplementation({
                    interpretations: {
                        interpretations: mockData.interpretations.concat(
                            mockData.newInterpretation
                        ),
                    },
                })
            )
            const initialListLength =
                result.current.interpretationsList.data.length

            act(() => {
                result.current.mutations.createInterpretation()
            })

            await waitFor(() => {
                expect(result.current.interpretationsList.data.length).toBe(
                    initialListLength + 1
                )
            })
        })
        test('Deleting an interpretation updates the list', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            mockMutate.mockImplementationOnce(createMockImplementation({}))
            const initialListLength =
                result.current.interpretationsList.data.length

            act(() => {
                result.current.mutations.deleteInterpretation()
            })

            await waitFor(() => {
                expect(result.current.interpretationsList.data.length).toBe(
                    initialListLength - 1
                )
            })
        })
        test('Updating an interpretation text updates the (active) interpretation', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            mockMutate.mockImplementationOnce(createMockImplementation({}))

            act(() => {
                result.current.mutations.updateInterpretationText()
            })

            await waitFor(() => {
                expect(result.current.interpretation.text).toBe('Updated text')
                expect(result.current.activeInterpretation.data.text).toBe(
                    'Updated text'
                )
            })
        })
        /* Note that adding/removing likes also updates the interpretation state, but this
         * behaviour is asserted in the "Like behaviour" tests above */
        test('Adding a comment to an interpretation updates the (active) interpretation', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            mockMutate.mockImplementationOnce(createMockImplementation({}))
            mockQuery.mockImplementationOnce(
                createMockImplementation({
                    interpretation: {
                        ...mockData.interpretationDetails,
                        comments: [
                            ...mockData.interpretationDetails.comments,
                            mockData.newComment,
                        ],
                    },
                })
            )

            const initialCommentsLength =
                result.current.interpretation.comments.length

            act(() => {
                result.current.mutations.addComment()
            })

            await waitFor(() => {
                expect(result.current.interpretation.comments.length).toBe(
                    initialCommentsLength + 1
                )
                expect(
                    result.current.activeInterpretation.data.comments.length
                ).toBe(initialCommentsLength + 1)
            })
        })
        test('Removing a comment from an interpretation updates the (active) interpretation', async () => {
            const { result } = await shouldLoadActiveInterpretation()
            mockMutate.mockImplementationOnce(createMockImplementation({}))

            const initialCommentsLength =
                result.current.interpretation.comments.length

            act(() => {
                result.current.mutations.deleteComment()
            })

            await waitFor(() => {
                expect(result.current.interpretation.comments.length).toBe(
                    initialCommentsLength - 1
                )
                expect(
                    result.current.activeInterpretation.data.comments.length
                ).toBe(initialCommentsLength - 1)
            })
        })
    })
})
