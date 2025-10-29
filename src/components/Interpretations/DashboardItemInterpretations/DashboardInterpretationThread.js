import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    CenteredContent,
    CircularLoader,
    Button,
    IconChevronLeft16,
    NoticeBox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { InterpretationThread } from '../InterpretationModal/InterpretationThread.js'
import { useActiveInterpretation } from '../InterpretationsProvider/hooks.js'

export const DashboardInterpretationThread = ({
    interpretationId,
    onClose,
    dashboardRedirectUrl,
    initialFocus,
}) => {
    const {
        data: interpretation,
        loading,
        error,
    } = useActiveInterpretation(interpretationId)

    if (loading) {
        return (
            <Layer>
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </Layer>
        )
    }

    return (
        <div className="container">
            <div className="button-container">
                <Button small icon={<IconChevronLeft16 />} onClick={onClose}>
                    {i18n.t('Back to all interpretations')}
                </Button>
            </div>
            {error && (
                <NoticeBox
                    error
                    title={i18n.t('Could not load interpretation details')}
                >
                    {i18n.t(
                        'The request to fetch interpretation comments failed'
                    )}
                </NoticeBox>
            )}
            {interpretation && !error && (
                <InterpretationThread
                    loading={loading}
                    interpretation={interpretation}
                    onInterpretationDeleted={onClose}
                    initialFocus={initialFocus}
                    dashboardRedirectUrl={dashboardRedirectUrl}
                />
            )}
            <style jsx>{`
                .container {
                    padding: var(--spacers-dp16) var(--spacers-dp16)
                        var(--spacers-dp32) var(--spacers-dp16);
                }
                .button-container {
                    margin-bottom: var(--spacers-dp8);
                }
            `}</style>
        </div>
    )
}

DashboardInterpretationThread.propTypes = {
    interpretationId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    dashboardRedirectUrl: PropTypes.string,
    initialFocus: PropTypes.bool,
}
