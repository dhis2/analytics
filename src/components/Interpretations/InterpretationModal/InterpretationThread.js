import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import { Interpretation, getInterpretationAccess } from '../common/index.js'
import { useInterpretationsCurrentUser } from '../InterpretationsProvider/hooks.js'
import { Comment } from './Comment.js'
import { CommentAddForm } from './CommentAddForm.js'

const InterpretationThread = ({
    loading,
    interpretation,
    onInterpretationDeleted,
    initialFocus,
    downloadMenuComponent: DownloadMenu,
    dashboardRedirectUrl,
}) => {
    const currentUser = useInterpretationsCurrentUser()
    const focusRef = useRef()

    useEffect(() => {
        if (initialFocus && focusRef.current) {
            window.setTimeout(() => {
                focusRef.current.focus()
            }, 25)
        }
    }, [initialFocus])

    const interpretationAccess = getInterpretationAccess(
        interpretation,
        currentUser
    )

    return (
        <div
            className={cx('container', {
                fetching: loading,
                dashboard: !!dashboardRedirectUrl,
            })}
        >
            {DownloadMenu && (
                <DownloadMenu relativePeriodDate={interpretation.created} />
            )}
            <div className={'thread'}>
                <Interpretation
                    id={interpretation.id}
                    onReplyIconClick={
                        interpretationAccess.comment
                            ? () => focusRef.current?.focus()
                            : null
                    }
                    dashboardRedirectUrl={dashboardRedirectUrl}
                    isInThread
                    onDeleted={onInterpretationDeleted}
                />
                <div className={'comments'}>
                    {interpretation.comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            canComment={interpretationAccess.comment}
                        />
                    ))}
                </div>
            </div>
            {interpretationAccess.comment && (
                <CommentAddForm focusRef={focusRef} />
            )}
            <style jsx>{`
                .thread {
                    overflow-y: auto;
                    scroll-behavior: smooth;
                }

                .dashboard .thread {
                    overflow-y: hidden;
                }

                .container {
                    position: relative;
                    overflow: auto;
                    max-height: calc(100vh - 258px);
                    display: flex;
                    flex-direction: column;
                }

                .container.dashboard {
                    max-height: none;
                }

                .container.fetching::before {
                    content: '';
                    position: absolute;
                    inset: 0px;
                    background-color: rgba(255, 255, 255, 0.8);
                }

                .container.fetching::after {
                    content: '';
                    position: absolute;
                    top: calc(50% - 12px);
                    left: calc(50% - 12px);
                    width: 24px;
                    height: 24px;
                    border-width: 4px;
                    border-style: solid;
                    border-color: rgba(110, 122, 138, 0.15)
                        rgba(110, 122, 138, 0.15) rgb(20, 124, 215);
                    border-image: initial;
                    border-radius: 50%;
                    animation: 1s linear 0s infinite normal none running
                        rotation;
                }

                .comments {
                    margin-inline-start: var(--spacers-dp4);
                    margin-block-start: var(--spacers-dp8);
                    margin-block-end: var(--spacers-dp12);
                    padding-inline-start: var(--spacers-dp12);
                    display: flex;
                    flex-direction: column;
                    padding-block-start: var(--spacers-dp4);
                    gap: var(--spacers-dp16);
                    border-inline-start: 2px solid var(--colors-grey300);
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
    interpretation: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    onInterpretationDeleted: PropTypes.func.isRequired,
    dashboardRedirectUrl: PropTypes.string,
    downloadMenuComponent: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    initialFocus: PropTypes.bool,
}

export { InterpretationThread }
