import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    IconChevronDown24,
    IconChevronUp24,
    colors,
    spacers,
    NoticeBox,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useInterpretationsList } from '../InterpretationsProvider/hooks.js'
import { InterpretationForm } from './InterpretationForm.js'
import { InterpretationList } from './InterpretationList.js'

export const InterpretationsUnit = ({
    type,
    id,
    visualizationHasTimeDimension = true,
    onInterpretationClick,
    onReplyIconClick,
    disabled,
    dashboardRedirectUrl,
}) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const showNoTimeDimensionHelpText =
        type === 'eventVisualization' && !visualizationHasTimeDimension
    const {
        data: interpretations,
        loading,
        error,
    } = useInterpretationsList(type, id)

    return (
        <div
            className={cx('container', {
                expanded: isExpanded,
            })}
        >
            <div className="header" onClick={() => setIsExpanded(!isExpanded)}>
                <span className="title">{i18n.t('Interpretations')}</span>
                {isExpanded ? (
                    <IconChevronUp24 color={colors.grey700} />
                ) : (
                    <IconChevronDown24 color={colors.grey700} />
                )}
            </div>
            {isExpanded && (
                <>
                    {loading && (
                        <div className="loader">
                            <CircularLoader small />
                        </div>
                    )}
                    {error && (
                        <NoticeBox
                            error
                            title={i18n.t('Error loading interpretations')}
                        >
                            {error.message ||
                                i18n.t('Could not load interpretations')}
                        </NoticeBox>
                    )}
                    {interpretations && (
                        <>
                            <InterpretationForm
                                type={type}
                                id={id}
                                disabled={disabled}
                                showNoTimeDimensionHelpText={
                                    showNoTimeDimensionHelpText
                                }
                            />
                            <InterpretationList
                                interpretations={interpretations}
                                onInterpretationClick={onInterpretationClick}
                                onReplyIconClick={onReplyIconClick}
                                disabled={disabled}
                                dashboardRedirectUrl={dashboardRedirectUrl}
                            />
                        </>
                    )}
                </>
            )}
            <style jsx>{`
                .container {
                    position: relative;
                    padding: ${spacers.dp16};
                    border-bottom: 1px solid ${colors.grey400};
                    background-color: ${colors.white};
                }

                .expanded {
                    padding-bottom: ${spacers.dp32};
                }

                .loader {
                    display: flex;
                    justify-content: center;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    cursor: pointer;
                }

                .title {
                    font-size: 16px;
                    font-weight: 500;
                    line-height: 21px;
                    color: ${colors.grey900};
                }
            `}</style>
        </div>
    )
}

InterpretationsUnit.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    onInterpretationClick: PropTypes.func.isRequired,
    dashboardRedirectUrl: PropTypes.string,
    disabled: PropTypes.bool,
    visualizationHasTimeDimension: PropTypes.bool,
    onReplyIconClick: PropTypes.func,
}
