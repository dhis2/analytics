import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconDelete16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { MessageIconButton } from '../common/index.js'

const mutation = {
    resource: 'interpretations',
    id: ({ interpretationId, commentId }) =>
        `${interpretationId}/comments/${commentId}`,
    type: 'delete',
}

const CommentDeleteButton = ({ commentId, interpretationId, onComplete }) => {
    const [remove, { loading }] = useDataMutation(mutation, {
        onComplete,
        variables: { commentId, interpretationId },
    })
    return (
        <MessageIconButton
            tooltipContent={i18n.t('Delete')}
            iconComponent={IconDelete16}
            onClick={remove}
            disabled={loading}
        />
    )
}

CommentDeleteButton.propTypes = {
    commentId: PropTypes.string.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
}

export { CommentDeleteButton }
