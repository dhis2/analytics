import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    IconChevronDown24,
    IconChevronUp24,
    IconClock16,
    IconShare16,
    IconSubscribe24,
    IconSubscribeOff24,
    IconUser16,
    IconView16,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import classes from './styles/AboutVisualizationUnit.module.css'

const dataStatisticsQuery = {
    dataStatistics: {
        resource: 'dataStatistics/favorites',
        id: ({ id }) => id,
    },
}

const getSubscriptionMutation = (id, isSubscribed) => ({
    resource: `eventReports/${id}/subscriber`,
    type: isSubscribed ? 'delete' : 'create',
})

const AboutVisualizationUnit = ({ visualization, onToggleSubscription }) => {
    const [isExpanded, setIsExpanded] = useState(true)
    const [isSubscribed, setIsSubscribed] = useState(
        visualization.subscribed || false
    )

    const { data: dataStatisticsResponse } = useDataQuery(dataStatisticsQuery, {
        variables: {
            id: visualization.id,
        },
    })

    const subscriptionMutation = useMemo(
        () => getSubscriptionMutation(visualization.id, isSubscribed),
        []
    )

    const [toggleSubscription] = useDataMutation(subscriptionMutation, {
        onComplete: res => {
            if (res.status === 'OK') {
                setIsSubscribed(!isSubscribed)

                onToggleSubscription()
            }
        },
    })

    const getAccessLevelString = access => {
        const accessMatch = access.match(/(?<accessLevel>rw?)/)

        switch (accessMatch.groups.accessLevel) {
            case 'r':
                return i18n.t('view only')
            case 'rw':
                return i18n.t('view and edit')
        }
    }

    const getSharingSummary = () => {
        const sharingText = []

        if (/^rw?/.test(visualization.publicAccess)) {
            sharingText.push(
                i18n.t('all users ({{accessLevel}})', {
                    accessLevel: getAccessLevelString(
                        visualization.publicAccess
                    ),
                })
            )
        }

        const userAccesses = visualization.userAccesses
        const groupAccesses = visualization.userGroupAccesses

        userAccesses.concat(groupAccesses).forEach(accessRule => {
            sharingText.push(
                i18n.t('{{userOrGroup}} ({{accessLevel}})', {
                    userOrGroup: accessRule.displayName,
                    accessLevel: getAccessLevelString(accessRule.access),
                })
            )
        })

        return sharingText.length
            ? i18n.t('Shared with {{commaSeparatedListOfUsersGroups}}', {
                  commaSeparatedListOfUsersGroups: sharingText.join(', '),
              })
            : i18n.t('Not shared with any users or groups')
    }

    return (
        <div
            className={cx(classes.container, {
                [classes.expanded]: isExpanded,
            })}
        >
            <div
                className={classes.header}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {i18n.t('About this visualization')}
                {isExpanded ? (
                    <IconChevronUp24 color={colors.grey700} />
                ) : (
                    <IconChevronDown24 color={colors.grey700} />
                )}
            </div>
            {isExpanded && (
                <div className={classes.content}>
                    <p
                        className={cx({
                            [classes.noDescription]: !visualization.description,
                        })}
                    >
                        {visualization.description
                            ? visualization.description
                            : i18n.t('No description')}
                    </p>
                    <div>
                        <p>
                            <IconShare16 color={colors.grey700} />
                            {getSharingSummary()}
                        </p>
                        <p>
                            <IconClock16 color={colors.grey700} />
                            {i18n.t('Last updated {{time}}', {
                                time: moment(
                                    visualization.lastUpdated
                                ).fromNow(),
                            })}
                        </p>
                        <p>
                            <IconUser16 color={colors.grey700} />
                            {i18n.t('Created {{time}} by {{author}}', {
                                time: moment(visualization.created).fromNow(),
                                author: visualization.createdBy.displayName,
                            })}
                        </p>
                        {dataStatisticsResponse && (
                            <p>
                                <IconView16 color={colors.grey700} />
                                {i18n.t('Viewed {{count}} times', {
                                    count: dataStatisticsResponse.dataStatistics
                                        .views,
                                    defaultValue: 'Viewed 1 time',
                                    defaultValue_plural:
                                        'Viewed {{count}} times',
                                })}
                            </p>
                        )}
                    </div>
                    <div className={classes.subsection}>
                        <span className={classes.subsectionTitle}>
                            {i18n.t('Notifications')}
                        </span>
                        {isSubscribed ? (
                            <>
                                <p>
                                    {i18n.t(
                                        "You're subscribed and getting updates about new interpretations."
                                    )}
                                </p>
                                <Button
                                    icon={
                                        <IconSubscribeOff24
                                            color={colors.grey700}
                                        />
                                    }
                                    secondary
                                    small
                                    onClick={toggleSubscription}
                                >
                                    {i18n.t('Unsubscribe')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <p>
                                    {i18n.t(
                                        'Subscribe to get updates about new interpretations.'
                                    )}
                                </p>
                                <Button
                                    icon={
                                        <IconSubscribe24
                                            color={colors.grey700}
                                        />
                                    }
                                    secondary
                                    small
                                    onClick={toggleSubscription}
                                >
                                    {i18n.t('Subscribe')}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

AboutVisualizationUnit.defaultProps = {
    onToggleSubscription: Function.prototype,
}

AboutVisualizationUnit.propTypes = {
    visualization: PropTypes.object.isRequired,
    onToggleSubscription: PropTypes.func,
}

export default AboutVisualizationUnit
