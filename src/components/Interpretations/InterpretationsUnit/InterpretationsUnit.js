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
                'access',
                'id',
                'user[displayName]',
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
            onInterpretationClick,
            onReplyIconClick,
            disabled,
        },
        ref
    ) => {
        const [isExpanded, setIsExpanded] = useState(true)

        const { data, loading, fetching, refetch } = useDataQuery(
            interpretationsQuery,
            {
                lazy: true,
            }
        )

        const onCompleteAction = () => {
            refetch({ type, id })
        }

        useImperativeHandle(
            ref,
            () => ({
                refresh: onCompleteAction,
            }),
            []
        )

        useEffect(() => {
            if (id) {
                refetch({ type, id })
            }
        }, [type, id])

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
                        {data && (
                            <>
                                <InterpretationForm
                                    currentUser={currentUser}
                                    type={type}
                                    id={id}
                                    onSave={onCompleteAction}
                                    disabled={disabled}
                                />
                                <InterpretationList
                                    currentUser={currentUser}
                                    interpretations={
                                        data.interpretations.interpretations
                                    }
                                    onInterpretationClick={
                                        onInterpretationClick
                                    }
                                    onReplyIconClick={onReplyIconClick}
                                    refresh={onCompleteAction}
                                    disabled={disabled}
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
}

InterpretationsUnit.propTypes = {
    currentUser: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    onInterpretationClick: PropTypes.func,
    onReplyIconClick: PropTypes.func,
}
