import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconDelete16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { MessageIconButton } from '../common/index.js'

const mutation = {
    resource: 'interpretations',
    id: ({ interpretationId, commentId }) =>
        `${interpretationId}/comments/${commentId}`,
    type: 'delete',
}

const CommentDeleteButton = ({ commentId, interpretationId, onComplete }) => {
    const [deleteError, setDeleteError] = useState(null)
    const [remove, { loading }] = useDataMutation(mutation, {
        onComplete: () => {
            setDeleteError(null)
            onComplete()
        },
        onError: () => setDeleteError(i18n.t('Delete failed')),
        variables: { commentId, interpretationId },
    })

    const onDelete = () => {
        setDeleteError(null)
        remove()
    }

    return (
        <div className="delete-button-container">
            <MessageIconButton
                tooltipContent={i18n.t('Delete')}
                iconComponent={IconDelete16}
                onClick={onDelete}
                disabled={loading}
            />
            {deleteError && <span className="delete-error">{deleteError}</span>}
            <style jsx>{`
                .delete-button-container {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .delete-error {
                    color: ${colors.red500};
                    font-size: 12px;
                    line-height: 12px;
                }
            `}</style>
        </div>
    )
}

CommentDeleteButton.propTypes = {
    commentId: PropTypes.string.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
}

export { CommentDeleteButton }
