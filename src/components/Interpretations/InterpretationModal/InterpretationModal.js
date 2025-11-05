import i18n from '@dhis2/d2-i18n'
import {
    Modal,
    ModalActions,
    ModalContent,
    NoticeBox,
    Button,
    spacers,
    colors,
    Layer,
    CenteredContent,
    CircularLoader,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import css from 'styled-jsx/css'
import {
    useActiveInterpretation,
    useInterpretationsCurrentUser,
} from '../InterpretationsProvider/hooks.js'
import { InterpretationThread } from './InterpretationThread.js'
import { useModalContentWidth } from './useModalContentWidth.js'

const modalCSS = css.resolve`
    aside {
        max-width: calc(100vw - 128px) !important;
        max-height: calc(100vh - 128px) !important;
        width: auto !important;
        height: calc(100vh - 128px) !important;
        overflow-y: hidden;
    }
    aside.hidden {
        display: none;
    }
    aside > :global(div) > :global(div) {
        height: 100%;
    }
`

function getModalContentCSS(width) {
    return css.resolve`
        div {
            width: ${width}px;
            overflow-y: visible;
        }
    `
}

const InterpretationModal = ({
    isVisualizationLoading,
    visualization,
    onResponsesReceived,
    downloadMenuComponent,
    onClose,
    interpretationId,
    initialFocus,
    pluginComponent: VisualizationPlugin,
}) => {
    const modalContentWidth = useModalContentWidth()
    const modalContentCSS = getModalContentCSS(modalContentWidth)
    const currentUser = useInterpretationsCurrentUser()
    const {
        data: interpretation,
        loading,
        error,
    } = useActiveInterpretation(interpretationId)
    const shouldRenderModalContent = !error && interpretation
    const loadingInProgress = loading || isVisualizationLoading

    const filters = useMemo(() => {
        return {
            relativePeriodDate: interpretation?.created,
        }
    }, [interpretation?.created])

    const displayProperty = useMemo(
        () =>
            // DV and EVER apps
            currentUser.settings?.displayProperty ??
            // LL app
            currentUser.settings?.keyAnalysisDisplayProperty ??
            // Maps app
            currentUser.keyAnalysisDisplayProperty,
        [currentUser]
    )

    return (
        <>
            {loadingInProgress && (
                <Layer>
                    <CenteredContent>
                        <CircularLoader />
                    </CenteredContent>
                </Layer>
            )}
            <Modal
                fluid
                onClose={onClose}
                className={cx(modalCSS.className, {
                    hidden: loadingInProgress,
                })}
                dataTest="interpretation-modal"
            >
                <h1 className="title">
                    <span className="ellipsis">
                        {i18n.t(
                            'Viewing interpretation: {{- visualisationName}}',
                            {
                                visualisationName:
                                    visualization.displayName ||
                                    visualization.name,
                                nsSeparator: '^^',
                            }
                        )}
                    </span>
                </h1>
                <ModalContent className={modalContentCSS.className}>
                    <div className="container">
                        {error && (
                            <NoticeBox
                                error
                                title={i18n.t('Could not load interpretation')}
                            >
                                {error.message ||
                                    i18n.t(
                                        'The interpretation couldn’t be displayed. Try again or contact your system administrator.'
                                    )}
                            </NoticeBox>
                        )}
                        {shouldRenderModalContent && (
                            <div className="row">
                                <div className="visualisation-wrap">
                                    <VisualizationPlugin
                                        filters={filters}
                                        visualization={visualization}
                                        onResponsesReceived={
                                            onResponsesReceived
                                        }
                                        displayProperty={displayProperty}
                                        isInModal={true}
                                    />
                                </div>
                                <div className="thread-wrap">
                                    <InterpretationThread
                                        loading={loading}
                                        interpretation={interpretation}
                                        initialFocus={initialFocus}
                                        downloadMenuComponent={
                                            downloadMenuComponent
                                        }
                                        onInterpretationDeleted={onClose}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </ModalContent>
                <ModalActions>
                    <Button disabled={loading} onClick={onClose}>
                        {i18n.t('Hide interpretation')}
                    </Button>
                </ModalActions>
                {modalCSS.styles}
                {modalContentCSS.styles}
                <style jsx>{`
                    .title {
                        color: ${colors.grey900};
                        margin: 0px;
                        padding: ${spacers.dp24} 0 ${spacers.dp4};
                    }

                    .ellipsis {
                        display: inline-block;
                        font-size: 20px;
                        font-weight: 500;
                        line-height: 24px;
                        white-space: nowrap;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .container {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                    }

                    .row {
                        display: flex;
                        flex-direction: row;
                        gap: 16px;
                        height: 100%;
                    }

                    .visualisation-wrap {
                        flex-grow: 1;
                        min-width: 0;
                    }

                    .thread-wrap {
                        padding-right: ${spacers.dp4};
                        flex-basis: 300px;
                        flex-shrink: 0;
                    }
                `}</style>
            </Modal>
        </>
    )
}

InterpretationModal.propTypes = {
    interpretationId: PropTypes.string.isRequired,
    isVisualizationLoading: PropTypes.bool.isRequired,
    pluginComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
        .isRequired,
    visualization: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onResponsesReceived: PropTypes.func.isRequired,
    downloadMenuComponent: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func,
    ]),
    initialFocus: PropTypes.bool,
}

export { InterpretationModal }
