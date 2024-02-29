import PropTypes from 'prop-types'
import React from 'react'
import { Interpretation } from '../common/index.js'
import { useLike } from '../common/Interpretation/useLike.js'

const ListInterpretation = ({
    interpretation,
    currentUser,
    onLikeChanged,
    ...rest
}) => {
    const { toggleLike, isLikedByCurrentUser, toggleLikeInProgress } = useLike({
        interpretation,
        currentUser,
        onComplete: onLikeChanged,
    })

    return (
        <Interpretation
            currentUser={currentUser}
            interpretation={interpretation}
            toggleLike={toggleLike}
            isLikedByCurrentUser={isLikedByCurrentUser}
            toggleLikeInProgress={toggleLikeInProgress}
            {...rest}
        />
    )
}

ListInterpretation.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretation: PropTypes.object.isRequired,
    onLikeChanged: PropTypes.func.isRequired,
}

export default ListInterpretation
