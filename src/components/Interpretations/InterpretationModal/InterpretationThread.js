import { IconClock16, colors } from '@dhis2/ui'
import cx from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import { Interpretation } from '../common/index.js'
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
    const focusRef = useRef()

    useEffect(() => {
        if (initialFocus && focusRef.current) {
            window.requestAnimationFrame(() => {
                focusRef.current.focus()
            })
        }
    }, [initialFocus, focusRef.current])

    return (
        <div className={cx('container', { fetching })}>
            <div className={'scrollbox'}>
                <div className={'title'}>
                    <IconClock16 color={colors.grey700} />
                    {moment(interpretation.created).format('LLL')}
                </div>
                <DownloadMenu relativePeriodDate={interpretation.created} />
                <Interpretation
                    currentUser={currentUser}
                    interpretation={interpretation}
                    onReplyIconClick={() => focusRef.current?.focus()}
                    onUpdated={() => onThreadUpdated(true)}
                    onDeleted={onInterpretationDeleted}
                />
                <div className={'comments'}>
                    {interpretation.comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            interpretationId={interpretation.id}
                            onThreadUpdated={onThreadUpdated}
                        />
                    ))}
                </div>
                <CommentAddForm
                    currentUser={currentUser}
                    interpretationId={interpretation.id}
                    onSave={() => onThreadUpdated(true)}
                    focusRef={focusRef}
                />
            </div>
            <style jsx>{`
                .container {
                    position: relative;
                    overflow: hidden;
                    max-height: calc(100vh - 285px);
                    display: flex;
                    flex-direction: column;
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

                .scrollbox {
                    overflow-y: auto;
                    scroll-behavior: smooth;
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
    downloadMenuComponent: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]).isRequired,
    fetching: PropTypes.bool.isRequired,
    interpretation: PropTypes.object.isRequired,
    onInterpretationDeleted: PropTypes.func.isRequired,
    initialFocus: PropTypes.bool,
    onThreadUpdated: PropTypes.func,
}

export { InterpretationThread }
