import { useTimeZoneConversion } from '@dhis2/app-runtime'
import { IconCalendar24, colors, spacers } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { Interpretation } from '../common/index.js'

export const InterpretationList = ({
    interpretationIdsByDate,
    onInterpretationClick,
    onReplyIconClick,
    disabled,
    dashboardRedirectUrl,
}) => {
    const { fromServerDate } = useTimeZoneConversion()

    return (
        <ol className="interpretation-groups" data-test="interpretations-list">
            {Object.keys(interpretationIdsByDate).map((date) => (
                <li key={date}>
                    <div className="date-section">
                        <IconCalendar24 color={colors.grey600} />
                        <time dateTime={date} className="date-header">
                            {moment(fromServerDate(date)).format('ll')}
                        </time>
                    </div>
                    <ol className="interpretation-list">
                        {interpretationIdsByDate[date].map(
                            (interpretationId) => (
                                <Interpretation
                                    key={interpretationId}
                                    id={interpretationId}
                                    onReplyIconClick={onReplyIconClick}
                                    dashboardRedirectUrl={dashboardRedirectUrl}
                                    disabled={disabled}
                                    onClick={onInterpretationClick}
                                />
                            )
                        )}
                    </ol>
                </li>
            ))}
            <style jsx>{`
                .date-section {
                    display: flex;
                    gap: ${spacers.dp8};
                    align-items: center;
                    margin-bottom: ${spacers.dp8};
                }

                .date-header {
                    font-size: 14px;
                    font-weight: 500;
                    line-height: ${spacers.dp16};
                    color: ${colors.grey800};
                }

                .interpretation-groups {
                    margin: 0;
                    padding: 0;
                    padding-top: ${spacers.dp12};
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: ${spacers.dp12};
                }

                .interpretation-list {
                    margin: 0;
                    padding-left: ${spacers.dp32};
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: ${spacers.dp4};
                }
            `}</style>
        </ol>
    )
}

InterpretationList.propTypes = {
    interpretationIdsByDate: PropTypes.objectOf(
        PropTypes.arrayOf(PropTypes.string)
    ).isRequired,
    onInterpretationClick: PropTypes.func.isRequired,
    onReplyIconClick: PropTypes.func.isRequired,
    dashboardRedirectUrl: PropTypes.string,
    disabled: PropTypes.bool,
}
