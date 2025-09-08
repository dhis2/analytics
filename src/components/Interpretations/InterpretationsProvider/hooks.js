import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react'
import {
    getCommentAccess,
    getInterpretationAccess,
} from '../common/getInterpretationAccess.js'
import { InterpretationsContext } from './InterpretationsProvider.js'

const SET_LOADING = 'SET_LOADING'
const SET_ERROR = 'SET_ERROR'
const SET_DATA = 'SET_DATA'
const RESET = 'RESET'
const initialLoadingState = {
    loading: false,
    error: undefined,
    data: undefined,
}

function loadingReducer(state, action) {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: true,
            }
        case SET_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false,
            }
        case SET_DATA:
            return {
                data: action.payload,
                error: undefined,
                loading: false,
            }
        case RESET:
            return { ...initialLoadingState }
        default:
            return state
    }
}

export const useInterpretationsManager = () => {
    const interpretationsManager = useContext(InterpretationsContext)

    if (!interpretationsManager) {
        throw new Error(
            'Called useInterpretationsManager() from outside an InterpretationsProvider'
        )
    }

    return interpretationsManager
}

export const useInterpretationsCurrentUser = () => {
    const interpretationsManager = useInterpretationsManager()
    return interpretationsManager.getCurrentUser()
}

export const useInterpretationsList = (type, id) => {
    const prevTypeRef = useRef(null)
    const prevIdRef = useRef(null)
    const interpretationsManager = useInterpretationsManager()
    const [state, dispatch] = useReducer(loadingReducer, initialLoadingState)
    const fetchList = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data =
                await interpretationsManager.loadInterpretationsForVisualization(
                    type,
                    id
                )
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [interpretationsManager, type, id, dispatch])

    // Ensure manager updates get propagated to the state
    useEffect(() => {
        const unsubscribe =
            interpretationsManager.subscribeToInterpretationsListUpdates(
                (interpretationIdsByDate) => {
                    dispatch({
                        type: SET_DATA,
                        payload: interpretationIdsByDate,
                    })
                }
            )
        return unsubscribe
    }, [interpretationsManager])

    // Fetch when mounting or after a reset
    useEffect(() => {
        if (type && id && !state.loading && !state.data && !state.error) {
            fetchList()
        }
    }, [fetchList, state, type, id])

    // Handle active item changes and clearance
    useEffect(() => {
        const prevType = prevTypeRef.current
        const prevId = prevIdRef.current
        const isTypeChange = prevType && type && prevType !== type
        const isIdChange = prevId && id && prevId !== id
        const isTypeClearance = prevType && !type
        const isIdClearance = prevId && !id
        if (isTypeChange || isIdChange || isTypeClearance || isIdClearance) {
            dispatch({ type: RESET })
        }
        if (isTypeClearance || isIdClearance) {
            interpretationsManager.clearInterpretations()
        }
        prevTypeRef.current = type
        prevIdRef.current = id
    }, [interpretationsManager, type, id])

    return state
}

export const useActiveInterpretation = (id) => {
    const prevIdRef = useRef(null)
    const interpretationsManager = useInterpretationsManager()
    const [state, dispatch] = useReducer(loadingReducer, initialLoadingState)
    const fetchInterpretation = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data = await interpretationsManager.loadActiveInterpretation(
                id
            )
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [interpretationsManager, id, dispatch])

    // Ensure manager updates get propagated to the state
    useEffect(() => {
        const unsubscribe =
            interpretationsManager.subscribeToInterpretationUpdates(
                id,
                (interpretation) => {
                    dispatch({ type: SET_DATA, payload: interpretation })
                }
            )
        return unsubscribe
    }, [interpretationsManager, id])

    // Fetch when mounting or after a reset
    useEffect(() => {
        if (id && !state.loading && !state.data && !state.error) {
            fetchInterpretation()
        }
    }, [fetchInterpretation, state, id])

    // Handle active item changes and clearance
    useEffect(() => {
        const prevId = prevIdRef.current
        const isIdChange = prevId && id && prevId !== id
        const isIdClearance = prevId && !id
        if (isIdChange || isIdClearance) {
            dispatch({ type: RESET })
        }
        if (isIdClearance) {
            interpretationsManager.clearActiveInterpretation()
        }
        prevIdRef.current = id
    }, [id, interpretationsManager])

    return state
}

export const useInterpretation = (id) => {
    const interpretationsManager = useInterpretationsManager()
    const [interpretation, setInterpretation] = useState(
        interpretationsManager.getInterpretation(id)
    )

    useEffect(() => {
        const unsubscribe =
            interpretationsManager.subscribeToInterpretationUpdates(
                id,
                (newInterpretation) => {
                    setInterpretation(newInterpretation)
                }
            )
        return unsubscribe
    }, [interpretationsManager, id])

    return interpretation
}

export const useLike = (id) => {
    const interpretationsManager = useInterpretationsManager()
    const [{ loading: toggleLikeInProgress, data: interpretation }, dispatch] =
        useReducer(loadingReducer, {
            ...initialLoadingState,
            data: interpretationsManager.getInterpretation(id),
        })
    const toggleLike = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data = await interpretationsManager.toggleInterpretationLike(
                id
            )
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [id, interpretationsManager])
    const isLikedByCurrentUser = useMemo(() => {
        const currentUser = interpretationsManager.getCurrentUser()
        return interpretation.likedBy.some(
            (likedBy) => likedBy.id === currentUser.id
        )
    }, [interpretation, interpretationsManager])

    return {
        isLikedByCurrentUser,
        toggleLike,
        toggleLikeInProgress,
    }
}

export const useInterpretationAccess = (interpretation) => {
    const currentUser = useInterpretationsCurrentUser()
    const access = useMemo(
        () => getInterpretationAccess(interpretation, currentUser),
        [interpretation, currentUser]
    )
    return access
}

export const useCommentAccess = (comment, canComment) => {
    const currentUser = useInterpretationsCurrentUser()
    const access = useMemo(
        () => getCommentAccess(comment, canComment, currentUser),
        [comment, canComment, currentUser]
    )
    return access
}

const useInterpretationsManagerMutation = (methodName, options = {}) => {
    const interpretationsManager = useInterpretationsManager()
    const [state, dispatch] = useReducer(loadingReducer, initialLoadingState)

    const doAsyncCallback = useCallback(async () => {
        dispatch({ type: SET_LOADING })
        try {
            const data = await interpretationsManager[methodName](options)
            dispatch({ type: SET_DATA, payload: data })
        } catch (error) {
            console.error(error)
            dispatch({ type: SET_ERROR, payload: error })
        }
    }, [interpretationsManager, methodName, options])

    return [doAsyncCallback, state]
}

export const useCreateInterpretation = (options) =>
    useInterpretationsManagerMutation('createInterpretation', options)

export const useUpdateInterpretationText = (options) =>
    useInterpretationsManagerMutation('updateInterpretationText', options)

export const useDeleteInterpretation = (options) =>
    useInterpretationsManagerMutation('deleteInterpretation', options)

export const useAddCommentToActiveInterpretation = (options) =>
    useInterpretationsManagerMutation(
        'addCommentToActiveInterpretation',
        options
    )

export const useUpdateCommentForActiveInterpretation = (options) =>
    useInterpretationsManagerMutation(
        'updateCommentForActiveInterpretation',
        options
    )

export const useDeleteCommentFromActiveInterpretation = (options) =>
    useInterpretationsManagerMutation(
        'deleteCommentFromActiveInterpretation',
        options
    )
