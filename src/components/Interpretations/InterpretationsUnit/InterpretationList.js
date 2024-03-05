import { useTimeZoneConversion } from '@dhis2/app-runtime'
import { IconCalendar24, colors, spacers } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { Interpretation } from '../common/index.js'

const sortByCreatedDateDesc = (a, b) => {
    const dateA = a.created
    const dateB = b.created

    if (dateA < dateB) {
        return 1
    }
    if (dateA > dateB) {
        return -1
    }
    return 0
}

export const InterpretationList = ({
    currentUser,
    interpretations,
    onInterpretationClick,
    onLikeToggled,
    onReplyIconClick,
    refresh,
    disabled,
    dashboardRedirectUrl,
}) => {
    const { fromServerDate } = useTimeZoneConversion()
    const interpretationsByDate = interpretations.reduce(
        (groupedInterpretations, interpretation) => {
            const date = interpretation.created.split('T')[0]

            if (date in groupedInterpretations) {
                groupedInterpretations[date].push(interpretation)
            } else {
                groupedInterpretations[date] = [interpretation]
            }

            return groupedInterpretations
        },
        {}
    )

    return (
        <ol className="interpretation-groups" data-test="interpretations-list">
            {Object.keys(interpretationsByDate)
                .sort()
                .reverse()
                .map((date) => (
                    <li key={date}>
                        <div className="date-section">
                            <IconCalendar24 color={colors.grey600} />
                            <time dateTime={date} className="date-header">
                                {moment(fromServerDate(date)).format('ll')}
                            </time>
                        </div>
                        <ol className="interpretation-list">
                            {interpretationsByDate[date]
                                .sort(sortByCreatedDateDesc)
                                .map((interpretation) => (
                                    <Interpretation
                                        key={interpretation.id}
                                        interpretation={interpretation}
                                        currentUser={currentUser}
                                        onClick={onInterpretationClick}
                                        onLikeToggled={onLikeToggled}
                                        onReplyIconClick={onReplyIconClick}
                                        onDeleted={refresh}
                                        onUpdated={refresh}
                                        disabled={disabled}
                                        dashboardRedirectUrl={
                                            dashboardRedirectUrl
                                        }
                                    />
                                ))}
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
    currentUser: PropTypes.object.isRequired,
    interpretations: PropTypes.array.isRequired,
    refresh: PropTypes.func.isRequired,
    onInterpretationClick: PropTypes.func.isRequired,
    onLikeToggled: PropTypes.func.isRequired,
    onReplyIconClick: PropTypes.func.isRequired,
    dashboardRedirectUrl: PropTypes.string,
    disabled: PropTypes.bool,
}
