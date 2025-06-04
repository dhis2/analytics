import { useTimeZoneConversion } from '@dhis2/app-runtime'
import { IconClock16, colors } from '@dhis2/ui'
import cx from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useRef, useEffect } from 'react'
import { Interpretation, getInterpretationAccess } from '../common/index.js'
import { Comment } from './Comment.jsx'
import { CommentAddForm } from './CommentAddForm.jsx'

const InterpretationThread = ({
    currentUser,
    fetching,
    interpretation,
    onInterpretationDeleted,
    onLikeToggled,
    initialFocus,
    onThreadUpdated,
    downloadMenuComponent: DownloadMenu,
    dashboardRedirectUrl,
}) => {
    const { fromServerDate } = useTimeZoneConversion()
    const focusRef = useRef()

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
        <div
            className={cx('container', {
                fetching,
                dashboard: !!dashboardRedirectUrl,
            })}
        >
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
                    onLikeToggled={onLikeToggled}
                    onReplyIconClick={
                        interpretationAccess.comment
                            ? () => focusRef.current?.focus()
                            : null
                    }
                    onUpdated={() => onThreadUpdated(true)}
                    onDeleted={onInterpretationDeleted}
                    dashboardRedirectUrl={dashboardRedirectUrl}
                    isInThread={true}
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
                        />
                    ))}
                </div>
            </div>
            {interpretationAccess.comment && (
                <CommentAddForm
                    currentUser={currentUser}
                    interpretationId={interpretation.id}
                    onSave={() => onThreadUpdated(true)}
                    focusRef={focusRef}
                />
            )}
            <style jsx>{`
                .thread {
                    margin-top: var(--spacers-dp16);
                    overflow-y: auto;
                    scroll-behavior: smooth;
                }

                .dashboard .thread {
                    overflow-y: hidden;
                }

                .container {
                    position: relative;
                    overflow: auto;
                    max-height: calc(100vh - 285px);
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
    onLikeToggled: PropTypes.func.isRequired,
    dashboardRedirectUrl: PropTypes.string,
    downloadMenuComponent: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    initialFocus: PropTypes.bool,
    onThreadUpdated: PropTypes.func,
}

export { InterpretationThread }
