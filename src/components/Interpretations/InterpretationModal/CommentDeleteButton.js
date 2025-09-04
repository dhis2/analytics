import i18n from '@dhis2/d2-i18n'
import { IconDelete16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { MessageIconButton } from '../common/index.js'
import { useDeleteCommentFromActiveInterpretation } from '../InterpretationsProvider/hooks.js'

const CommentDeleteButton = ({ id }) => {
    const [remove, { loading, error }] =
        useDeleteCommentFromActiveInterpretation(id)

    return (
        <div className="delete-button-container">
            <MessageIconButton
                tooltipContent={i18n.t('Delete')}
                iconComponent={IconDelete16}
                onClick={remove}
                disabled={loading}
            />
            {error && (
                <span className="delete-error">
                    {i18n.t('Could not delete comment')}
                </span>
            )}
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
    id: PropTypes.string.isRequired,
}

export { CommentDeleteButton }
