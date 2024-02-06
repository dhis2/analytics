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
        },
        ref
    ) => {
        const [isExpanded, setIsExpanded] = useState(true)
        const [fetchingComplete, setFetchingComplete] = useState(true)
        const [listUpdateInProgress, setListUpdateInProgress] = useState(false)
        const showNoTimeDimensionHelpText =
            type === 'eventVisualization' && !visualizationHasTimeDimension

        const { data, loading, refetch, fetching } = useDataQuery(
            interpretationsQuery,
            {
                lazy: true,
                onComplete: () => {
                    setFetchingComplete(true)
                    setListUpdateInProgress(false)
                },
            }
        )

        const updateInterpretationsList = useCallback(() => {
            setFetchingComplete(false)
            setListUpdateInProgress(true)
            refetch({ type, id })
        }, [type, id, refetch])

        const updateLikes = useCallback(() => {
            setFetchingComplete(false)
            refetch({ type, id })
        }, [type, id, refetch])

        useImperativeHandle(
            ref,
            () => ({
                refresh: updateInterpretationsList,
            }),
            [updateInterpretationsList]
        )

        useEffect(() => {
            if (id) {
                setFetchingComplete(false)
                refetch({ type, id })
            }
        }, [type, id, renderId, refetch])

        console.log('jj Unit', {
            loading,
            fetching,
            fetchingComplete,
            listUpdateInProgress,
        })

        return (
            <div
                className={cx('container', {
                    expanded: isExpanded,
                })}
            >
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
                        {(loading || listUpdateInProgress) && (
                            <div className="loader">
                                <CircularLoader small />
                            </div>
                        )}
                        {data && (
                            <>
                                <InterpretationForm
                                    currentUser={currentUser}
                                    type={type}
                                    id={id}
                                    onSave={updateInterpretationsList}
                                    disabled={disabled}
                                    showNoTimeDimensionHelpText={
                                        showNoTimeDimensionHelpText
                                    }
                                    fetching={fetching || !fetchingComplete}
                                />
                                <InterpretationList
                                    currentUser={currentUser}
                                    fetching={fetching || !fetchingComplete}
                                    interpretations={
                                        data.interpretations.interpretations
                                    }
                                    onInterpretationClick={
                                        onInterpretationClick
                                    }
                                    onListUpdated={updateInterpretationsList}
                                    onLikeChanged={updateLikes}
                                    onReplyIconClick={onReplyIconClick}
                                    disabled={disabled}
                                    setInterpretationActionInProgress={
                                        setListUpdateInProgress
                                    }
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
    disabled: PropTypes.bool,
    renderId: PropTypes.number,
    visualizationHasTimeDimension: PropTypes.bool,
    onInterpretationClick: PropTypes.func,
    onReplyIconClick: PropTypes.func,
}
