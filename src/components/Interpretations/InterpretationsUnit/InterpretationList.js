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
    return (
        <ol className="interpretation-groups" data-test="interpretations-list">
            {Object.keys(interpretationIdsByDate).map((date) => (
                <li key={date}>
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
                .interpretation-groups {
                    margin: 0;
                    padding: 0;
                    padding-block-start: 20px;
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .interpretation-list {
                    margin: 0;
                    padding-inline-start: 0;
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
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
