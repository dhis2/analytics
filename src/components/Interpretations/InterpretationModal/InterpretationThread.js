import { useTimeZoneConversion, useDataMutation } from '@dhis2/app-runtime'
import {
    IconClock16,
    CenteredContent,
    CircularLoader,
    Cover,
    colors,
} from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useRef, useEffect, useState } from 'react'
import { Interpretation, getInterpretationAccess } from '../common/index.js'
import { useLike } from '../common/Interpretation/useLike.js'
import { Comment } from './Comment.js'
import { CommentAddForm } from './CommentAddForm.js'

const InterpretationThread = ({
    currentUser,
    fetching,
    interpretation,
    onInterpretationDeleted,
    initialFocus,
    onThreadUpdated,
    downloadMenuComponent: DownloadMenu,
}) => {
    const [commentActionInProgress, setCommentActionInProgress] =
        useState(false)

    const { toggleLike, isLikedByCurrentUser, toggleLikeInProgress } = useLike({
        interpretation,
        currentUser,
        onComplete: () => onThreadUpdated(true),
    })
    const { fromServerDate } = useTimeZoneConversion()
    const focusRef = useRef()

    const saveMutationRef = useRef({
        resource: `interpretations/${interpretation.id}/comments`,
        type: 'create',
        data: ({ commentText }) => commentText,
    })

    const [save, { loading: loadingNewComment }] = useDataMutation(
        saveMutationRef.current,
        {
            onComplete: () => {
                onThreadUpdated(true)
            },
        }
    )

    useEffect(() => {
        if (initialFocus && focusRef.current) {
            window.requestAnimationFrame(() => {
                focusRef.current.focus()
            })
        }
    }, [initialFocus])

    const interpretationAccess = getInterpretationAccess(
        interpretation,
        currentUser
    )

    return (
        <div className="container">
            {fetching ||
            toggleLikeInProgress ||
            loadingNewComment ||
            commentActionInProgress ? (
                <Cover>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Cover>
            ) : null}
            <div className={'title'}>
                <IconClock16 color={colors.grey700} />
                {moment(fromServerDate(interpretation.created)).format('LLL')}
            </div>
            {DownloadMenu && (
                <DownloadMenu relativePeriodDate={interpretation.created} />
            )}
            <div className={'thread'}>
                <Interpretation
                    currentUser={currentUser}
                    interpretation={interpretation}
                    onReplyIconClick={
                        interpretationAccess.comment
                            ? () => focusRef.current?.focus()
                            : null
                    }
                    onDeleted={onInterpretationDeleted}
                    isInThread={true}
                    toggleLike={toggleLike}
                    isLikedByCurrentUser={isLikedByCurrentUser}
                    toggleLikeInProgress={toggleLikeInProgress || fetching}
                />
                <div className={'comments'}>
                    {interpretation.comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            interpretationId={interpretation.id}
                            onThreadUpdated={onThreadUpdated}
                            canComment={interpretationAccess.comment}
                            fetching={fetching || commentActionInProgress}
                            setCommentActionInProgress={
                                setCommentActionInProgress
                            }
                        />
                    ))}
                </div>
            </div>
            {interpretationAccess.comment && (
                <CommentAddForm
                    currentUser={currentUser}
                    interpretationId={interpretation.id}
                    focusRef={focusRef}
                    fetching={
                        fetching || loadingNewComment || commentActionInProgress
                    }
                    save={save}
                />
            )}
            <style jsx>{`
                .thread {
                    margin-top: var(--spacers-dp16);
                    overflow-y: auto;
                    scroll-behavior: smooth;
                }

                .container {
                    position: relative;
                    overflow: auto;
                    max-height: calc(100vh - 285px);
                    display: flex;
                    flex-direction: column;
                }

                .title {
                    display: flex;
                    align-items: center;
                    gap: var(--spacers-dp8);
                    color: var(--colors-grey900);
                    font-size: 14px;
                    line-height: 18px;
                }

                .comments {
                    padding-left: 16px;
                    display: flex;
                    flex-direction: column;
                    padding-top: var(--spacers-dp4);
                    gap: var(--spacers-dp4);
                }

                @keyframes rotation {
                    0% {
                        transform: rotate(0);
                    }

                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    )
}

InterpretationThread.propTypes = {
    currentUser: PropTypes.object.isRequired,
    fetching: PropTypes.bool.isRequired,
    interpretation: PropTypes.object.isRequired,
    onInterpretationDeleted: PropTypes.func.isRequired,
    downloadMenuComponent: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    initialFocus: PropTypes.bool,
    onThreadUpdated: PropTypes.func,
}

export { InterpretationThread }
