import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    CenteredContent,
    CircularLoader,
    Button,
    IconChevronLeft16,
    spacers,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { InterpretationThread } from '../../InterpretationModal/InterpretationThread.js'

const query = {
    interpretation: {
        resource: 'interpretations',
        id: ({ id }) => id,
        params: {
            fields: [
                'access',
                'id',
                'text',
                'created',
                'user[id,displayName]',
                'likes',
                'likedBy',
                'comments[access,id,text,created,createdBy[id,displayName]]',
            ],
        },
    },
}

export const InterpretationReplyForm = ({
    currentUser,
    interpretationId,
    onGoBackClicked,
    onInterpretationDeleted,
    launchUrl,
}) => {
    const { data, refetch, loading, fetching } = useDataQuery(query, {
        lazy: true,
    })
    const interpretation = data?.interpretation

    useEffect(() => {
        if (interpretationId) {
            refetch({ id: interpretationId })
        }
    }, [interpretationId, refetch])

    const onThreadUpdated = () => refetch({ id: interpretationId })

    if (loading || !interpretation) {
        return (
            <Layer>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    return (
        <div className="reply-container">
            <div className="button-wrapper">
                <Button
                    small
                    icon={<IconChevronLeft16 />}
                    onClick={onGoBackClicked}
                >
                    {i18n.t('Back to all interpretations')}
                </Button>
            </div>
            <InterpretationThread
                currentUser={currentUser}
                fetching={fetching}
                interpretation={interpretation}
                onInterpretationDeleted={onInterpretationDeleted}
                onThreadUpdated={onThreadUpdated}
                initialFocus={true}
                disableScrollbox={true}
                launchUrl={launchUrl}
            />
            <style jsx>{`
                .reply-container {
                    padding: ${spacers.dp16} ${spacers.dp16} ${spacers.dp32}
                        ${spacers.dp16};
                }
                .button-wrapper {
                    margin-bottom: ${spacers.dp8};
                }
            `}</style>
        </div>
    )
}

InterpretationReplyForm.displayName = 'InterpretationReplyForm'

InterpretationReplyForm.defaultProps = {
    onInterpretationDeleted: Function.prototype,
}

InterpretationReplyForm.propTypes = {
    currentUser: PropTypes.object.isRequired,
    interpretationId: PropTypes.string.isRequired,
    onGoBackClicked: PropTypes.func.isRequired,
    launchUrl: PropTypes.string,
    onInterpretationDeleted: PropTypes.func,
}
