import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { IconDelete16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { MessageIconButton } from '../index.js'

const mutation = {
    resource: 'interpretations',
    id: ({ id }) => id,
    type: 'delete',
}

const InterpretationDeleteButton = ({
    id,
    onComplete,
    setDeleteInProgress,
}) => {
    const [remove, { loading }] = useDataMutation(mutation, {
        onComplete: () => {
            setDeleteInProgress(false)
            onComplete()
        },
        variables: { id },
    })

    const deleteInterpretation = () => {
        setDeleteInProgress(true)
        remove()
    }
    return (
        <MessageIconButton
            tooltipContent={i18n.t('Delete')}
            iconComponent={IconDelete16}
            onClick={deleteInterpretation}
            disabled={loading}
            dataTest="interpretation-delete-button"
        />
    )
}

InterpretationDeleteButton.propTypes = {
    id: PropTypes.string.isRequired,
    onComplete: PropTypes.func.isRequired,
}

export { InterpretationDeleteButton }
