import i18n from '@dhis2/d2-i18n'
import {
    Button,
    SharingDialog,
    IconReply16,
    IconShare16,
    IconThumbUp16,
    IconEdit16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    Message,
    MessageStatsBar,
    MessageIconButton,
    getInterpretationAccess,
} from '../index.js'
import { InterpretationDeleteButton } from './InterpretationDeleteButton.js'
import { InterpretationUpdateForm } from './InterpretationUpdateForm.js'
import { useLike } from './useLike.js'

export const Interpretation = ({
    interpretation,
    currentUser,
    onClick,
    onUpdated,
    onDeleted,
    disabled,
    onReplyIconClick,
    isInThread,
}) => {
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    const [showSharingDialog, setShowSharingDialog] = useState(false)
    const { toggleLike, isLikedByCurrentUser, toggleLikeInProgress } = useLike({
        interpretation,
        currentUser,
        onComplete: onUpdated,
    })
    const shouldShowButton = !!onClick && !disabled

    const interpretationAccess = getInterpretationAccess(
        interpretation,
        currentUser
    )

    let tooltip = i18n.t('Reply')
    if (!interpretationAccess.reply) {
        if (isInThread) {
            tooltip = i18n.t('{{count}} replies', {
                count: interpretation.comments.length,
                defaultValue: '{{count}} reply',
                defaultValue_plural: '{{count}} replies',
            })
        } else {
            tooltip = i18n.t('View replies')
        }
    }

    return isUpdateMode ? (
        <InterpretationUpdateForm
            close={() => setIsUpdateMode(false)}
            id={interpretation.id}
            showSharingLink={interpretationAccess.share}
            onComplete={onUpdated}
            text={interpretation.text}
            currentUser={currentUser}
        />
    ) : (
        <Message
            text={interpretation.text}
            created={interpretation.created}
            username={interpretation.createdBy.displayName}
        >
            {!disabled && (
                <MessageStatsBar>
                    <MessageIconButton
                        tooltipContent={
                            isLikedByCurrentUser
                                ? i18n.t('Unlike')
                                : i18n.t('Like')
                        }
                        iconComponent={IconThumbUp16}
                        onClick={toggleLike}
                        selected={isLikedByCurrentUser}
                        count={interpretation.likes}
                        disabled={toggleLikeInProgress}
                        dataTest="interpretation-like-unlike-button"
                    />
                    <MessageIconButton
                        tooltipContent={tooltip}
                        iconComponent={IconReply16}
                        onClick={() =>
                            onReplyIconClick &&
                            onReplyIconClick(interpretation.id)
                        }
                        count={interpretation.comments.length}
                        dataTest="interpretation-reply-button"
                        viewOnly={isInThread && !interpretationAccess.reply}
                    />
                    {interpretationAccess.share && (
                        <MessageIconButton
                            iconComponent={IconShare16}
                            tooltipContent={i18n.t('Share')}
                            onClick={() => setShowSharingDialog(true)}
                            dataTest="interpretation-share-button"
                        />
                    )}
                    {showSharingDialog && (
                        <SharingDialog
                            open={true}
                            type={'interpretation'}
                            id={interpretation.id}
                            onClose={() => setShowSharingDialog(false)}
                        />
                    )}
                    <>
                        {interpretationAccess.edit && (
                            <MessageIconButton
                                iconComponent={IconEdit16}
                                tooltipContent={i18n.t('Edit')}
                                onClick={() => setIsUpdateMode(true)}
                                dataTest="interpretation-edit-button"
                            />
                        )}
                        {interpretationAccess.delete && (
                            <InterpretationDeleteButton
                                id={interpretation.id}
                                onComplete={onDeleted}
                            />
                        )}
                    </>
                </MessageStatsBar>
            )}
            {shouldShowButton && (
                <Button
                    secondary
                    small
                    onClick={(_, event) => {
                        event.stopPropagation()
                        onClick(interpretation.id)
                    }}
                >
                    {i18n.t('See interpretation')}
                </Button>
            )}
        </Message>
    )
}

Interpretation.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretation: PropTypes.object.isRequired,
    onDeleted: PropTypes.func.isRequired,
    onReplyIconClick: PropTypes.func.isRequired,
    onUpdated: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isInThread: PropTypes.bool,
    onClick: PropTypes.func,
}
