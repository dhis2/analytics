import { useDataMutation } from '@dhis2/app-runtime'
import { useEffect, useRef, useState } from 'react'

const useLike = ({ interpretation, currentUser, onComplete }) => {
    const resource = `interpretations/${interpretation.id}/like`
    const likeMutationRef = useRef({ resource, type: 'create' })
    const unlikeMutationRef = useRef({ resource, type: 'delete' })
    const [like, { loading: likeLoading }] = useDataMutation(
        likeMutationRef.current,
        { onComplete }
    )
    const [unlike, { loading: unlikeLoading }] = useDataMutation(
        unlikeMutationRef.current,
        { onComplete }
    )
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false)
    const toggleLike = () => {
        isLikedByCurrentUser ? unlike() : like()
    }

    useEffect(() => {
        setIsLikedByCurrentUser(
            interpretation.likedBy.some(
                (likedBy) => likedBy.id === currentUser.id
            )
        )
    }, [currentUser, interpretation])

    return {
        isLikedByCurrentUser,
        toggleLike,
        toggleLikeInProgress: likeLoading || unlikeLoading,
    }
}

export { useLike }
