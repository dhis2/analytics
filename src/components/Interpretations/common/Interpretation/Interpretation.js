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
import {
    useInterpretation,
    useInterpretationAccess,
    useLike,
} from '../../InterpretationsProvider/hooks.js'
import { Message, MessageStatsBar, MessageIconButton } from '../index.js'
import { InterpretationDeleteButton } from './InterpretationDeleteButton.js'
import { InterpretationUpdateForm } from './InterpretationUpdateForm.js'

export const Interpretation = ({
    id,
    onReplyIconClick,
    dashboardRedirectUrl,
    disabled,
    isInThread,
    onClick,
    onDeleted,
}) => {
    const interpretation = useInterpretation(id)
    const interpretationAccess = useInterpretationAccess(interpretation)
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    const [showSharingDialog, setShowSharingDialog] = useState(false)
    const { toggleLike, isLikedByCurrentUser, toggleLikeInProgress } =
        useLike(id)
    const shouldShowButton = Boolean(
        !!onClick && !disabled & !dashboardRedirectUrl
    )

    let tooltip = i18n.t('Reply')
    if (!interpretationAccess.comment) {
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

    // Maps still uses old url style /?id= instead of hash
    const getAppInterpretationUrl = () =>
        dashboardRedirectUrl.includes('?')
            ? `${dashboardRedirectUrl}&interpretationId=${id}`
            : `${dashboardRedirectUrl}?interpretationId=${id}`

    return isUpdateMode ? (
        <InterpretationUpdateForm
            onComplete={() => setIsUpdateMode(false)}
            id={id}
            showSharingLink={interpretationAccess.share}
            text={interpretation.text}
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
                        onClick={() => onReplyIconClick && onReplyIconClick(id)}
                        count={interpretation.comments.length}
                        dataTest="interpretation-reply-button"
                        viewOnly={isInThread && !interpretationAccess.comment}
                    />
                    {dashboardRedirectUrl && !isInThread && (
                        <MessageIconButton
                            tooltipContent={i18n.t('See interpretation')}
                            iconComponent={IconView16}
                            onClick={() => onClick(id)}
                            dataTest="interpretation-view-button"
                        />
                    )}
                    {dashboardRedirectUrl && (
                        <MessageIconButton
                            tooltipContent={i18n.t('Open in app')}
                            iconComponent={IconLaunch16}
                            onClick={() =>
                                window.open(getAppInterpretationUrl(), '_blank')
                            }
                            dataTest="interpretation-launch-in-app-button"
                        />
                    )}
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
                            id={id}
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
                                id={id}
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
                        onClick(id)
                    }}
                >
                    {i18n.t('See interpretation')}
                </Button>
            )}
        </Message>
    )
}

Interpretation.propTypes = {
    id: PropTypes.string.isRequired,
    onReplyIconClick: PropTypes.func.isRequired,
    dashboardRedirectUrl: PropTypes.string,
    disabled: PropTypes.bool,
    isInThread: PropTypes.bool,
    onClick: PropTypes.func,
    onDeleted: PropTypes.func,
}
