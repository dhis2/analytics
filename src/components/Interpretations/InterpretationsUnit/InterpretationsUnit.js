import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    CircularLoader,
    IconChevronDown24,
    IconChevronUp24,
    colors,
    spacers,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, {
    useCallback,
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
} from 'react'
import { InterpretationForm } from './InterpretationForm.js'
import { InterpretationList } from './InterpretationList.js'

const interpretationsQuery = {
    interpretations: {
        resource: 'interpretations',
        params: ({ type, id }) => ({
            fields: [
                'access[write,manage]',
                'id',
                'createdBy[id,displayName]',
                'created',
                'text',
                'comments[id]',
                'likes',
                'likedBy[id]',
            ],
            filter: `${type}.id:eq:${id}`,
        }),
    },
}

export const InterpretationsUnit = forwardRef(
    (
        {
            currentUser,
            type,
            id,
            visualizationHasTimeDimension,
            onInterpretationClick,
            onReplyIconClick,
            disabled,
            renderId,
            dashboardRedirectUrl,
        },
        ref
    ) => {
        const [isExpanded, setIsExpanded] = useState(true)
        const [interpretations, setInterpretations] = useState([])
        const showNoTimeDimensionHelpText =
            type === 'eventVisualization' && !visualizationHasTimeDimension

        const { loading, fetching, refetch } = useDataQuery(
            interpretationsQuery,
            {
                lazy: true,
                onComplete: (data) =>
                    setInterpretations(data.interpretations.interpretations),
            }
        )

        const onCompleteAction = useCallback(() => {
            refetch({ type, id })
        }, [type, id, refetch])

        useImperativeHandle(
            ref,
            () => ({
                refresh: onCompleteAction,
            }),
            [onCompleteAction]
        )

        useEffect(() => {
            if (id) {
                refetch({ type, id })
            }
        }, [type, id, renderId, refetch])

        const onLikeToggled = ({ id, likedBy }) => {
            const interpretation = interpretations.find(
                (interp) => interp.id === id
            )
            interpretation.likedBy = likedBy
            interpretation.likes = likedBy.length
        }

        return (
            <div
                className={cx('container', {
                    expanded: isExpanded,
                })}
            >
                {fetching && !loading && (
                    <div className="fetching-loader">
                        <CircularLoader small />
                    </div>
                )}
                <div
                    className="header"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
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
                        {interpretations && (
                            <>
                                <InterpretationForm
                                    currentUser={currentUser}
                                    type={type}
                                    id={id}
                                    onSave={onCompleteAction}
                                    disabled={disabled}
                                    showNoTimeDimensionHelpText={
                                        showNoTimeDimensionHelpText
                                    }
                                />
                                <InterpretationList
                                    currentUser={currentUser}
                                    interpretations={interpretations}
                                    onInterpretationClick={
                                        onInterpretationClick
                                    }
                                    onLikeToggled={onLikeToggled}
                                    onReplyIconClick={onReplyIconClick}
                                    refresh={onCompleteAction}
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

                    .fetching-loader {
                        position: absolute;
                        inset: 0px;
                        background-color: rgba(255, 255, 255, 0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1;
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
)

InterpretationsUnit.displayName = 'InterpretationsUnit'

InterpretationsUnit.defaultProps = {
    onInterpretationClick: Function.prototype,
    visualizationHasTimeDimension: true,
}

InterpretationsUnit.propTypes = {
    currentUser: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    dashboardRedirectUrl: PropTypes.string,
    disabled: PropTypes.bool,
    renderId: PropTypes.number,
    visualizationHasTimeDimension: PropTypes.bool,
    onInterpretationClick: PropTypes.func,
    onReplyIconClick: PropTypes.func,
}
