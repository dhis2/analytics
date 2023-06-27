import i18n from '@dhis2/d2-i18n'
import {
    Button,
    SharingDialog,
    IconReply16,
    IconShare16,
    IconThumbUp16,
    IconEdit16,
    IconLaunch16,
    IconView16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Message, MessageStatsBar, MessageIconButton } from '../index.js'
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
    dashboardRedirectUrl,
    isThread,
}) => {
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    const [showSharingDialog, setShowSharingDialog] = useState(false)
    const { toggleLike, isLikedByCurrentUser, toggleLikeInProgress } = useLike({
        interpretation,
        currentUser,
        onComplete: onUpdated,
    })
    const shouldShowButton = Boolean(
        !!onClick && !disabled & !dashboardRedirectUrl
    )

    return isUpdateMode ? (
        <InterpretationUpdateForm
            close={() => setIsUpdateMode(false)}
            id={interpretation.id}
            showSharingLink={interpretation.access.manage}
            onComplete={onUpdated}
            text={interpretation.text}
            currentUser={currentUser}
        />
    ) : (
        <Message
            text={interpretation.text}
            created={interpretation.created}
            username={interpretation.user.displayName}
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
                        tooltipContent={i18n.t('Reply')}
                        iconComponent={IconReply16}
                        onClick={() => onReplyIconClick(interpretation.id)}
                        count={interpretation.comments.length}
                        dataTest="interpretation-reply-button"
                    />
                    {dashboardRedirectUrl && !isThread && (
                        <MessageIconButton
                            tooltipContent={i18n.t('See interpretation')}
                            iconComponent={IconView16}
                            onClick={() => onClick(interpretation.id)}
                            dataTest="interpretation-view-button"
                        />
                    )}
                    {dashboardRedirectUrl && (
                        <MessageIconButton
                            tooltipContent={i18n.t('Open in app')}
                            iconComponent={IconLaunch16}
                            onClick={() =>
                                window.open(
                                    `${dashboardRedirectUrl}?interpretationId=${interpretation.id}`,
                                    '_blank'
                                )
                            }
                            dataTest="interpretation-launch-in-app-button"
                        />
                    )}
                    {interpretation.access.manage && (
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
                    {interpretation.access.update && (
                        <MessageIconButton
                            iconComponent={IconEdit16}
                            tooltipContent={i18n.t('Edit')}
                            onClick={() => setIsUpdateMode(true)}
                            dataTest="interpretation-edit-button"
                        />
                    )}
                    {interpretation.access.delete && (
                        <InterpretationDeleteButton
                            id={interpretation.id}
                            onComplete={onDeleted}
                        />
                    )}
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
    dashboardRedirectUrl: PropTypes.string,
    disabled: PropTypes.bool,
    isThread: PropTypes.bool,
    onClick: PropTypes.func,
}
