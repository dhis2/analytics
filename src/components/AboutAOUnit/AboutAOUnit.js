import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    CircularLoader,
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
import React, {
    useEffect,
    useMemo,
    useState,
    forwardRef,
    useImperativeHandle,
} from 'react'
import { formatList } from '../../modules/list.js'
import styles from './styles/AboutAOUnit.style.js'
import { getTranslatedString, AOTypeMap } from './utils.js'

const READ_ONLY = 'r'
const READ_AND_WRITE = 'rw'

const getQueries = (type) => ({
    ao: {
        resource: AOTypeMap[type].apiEndpoint,
        id: ({ id }) => id,
        params: {
            fields: 'id,displayDescription,created,createdBy[displayName],lastUpdated,subscribed,sharing',
        },
    },
    dataStatistics: {
        resource: 'dataStatistics/favorites',
        id: ({ id }) => id,
    },
})

const getSubscribeMutation = (type, id) => ({
    resource: `${AOTypeMap[type].apiEndpoint}/${id}/subscriber`,
    type: 'create',
})

const getUnsubscribeMutation = (type, id) => ({
    resource: `${AOTypeMap[type].apiEndpoint}/${id}/subscriber`,
    type: 'delete',
})

const AboutAOUnit = forwardRef(({ type, id, renderId }, ref) => {
    const [isExpanded, setIsExpanded] = useState(true)

    const queries = useMemo(() => getQueries(type), [type])

    const {
        data,
        loading: dataIsLoading,
        refetch,
    } = useDataQuery(queries, {
        lazy: true,
    })

    const subscribeMutation = useMemo(
        () => getSubscribeMutation(type, id),
        [type, id]
    )

    const unsubscribeMutation = useMemo(
        () => getUnsubscribeMutation(type, id),
        [type, id]
    )

    const [subscribe, { loading: subscribeIsLoading }] = useDataMutation(
        subscribeMutation,
        {
            onComplete: (res) => {
                if (res.status === 'OK') {
                    refetch({ id })
                }
            },
        }
    )

    const [unsubscribe, { loading: unsubscribeIsLoading }] = useDataMutation(
        unsubscribeMutation,
        {
            onComplete: (res) => {
                if (res.status === 'OK') {
                    refetch({ id })
                }
            },
        }
    )

    useEffect(() => {
        if (id) {
            refetch({ id })
        }
    }, [id, renderId, refetch])

    useImperativeHandle(
        ref,
        () => ({
            refresh: refetch,
        }),
        [refetch]
    )

    const getAccessLevelString = (access) => {
        const re = new RegExp(`(?<accessLevel>${READ_AND_WRITE}?)`)
        const accessMatch = re.exec(access)

        switch (accessMatch.groups.accessLevel) {
            case READ_ONLY:
                return i18n.t('view only')
            case READ_AND_WRITE:
                return i18n.t('view and edit')
        }
    }

    const getSharingSummary = (ao) => {
        const sharingTextParts = []

        const re = new RegExp(`^${READ_AND_WRITE}?`)

        if (re.test(ao.sharing.public)) {
            sharingTextParts.push(
                i18n.t('all users ({{accessLevel}})', {
                    accessLevel: getAccessLevelString(ao.sharing.public),
                })
            )
        }

        const userAccesses = ao.sharing.users
        const groupAccesses = ao.sharing.userGroups

        Object.values(userAccesses)
            .concat(Object.values(groupAccesses))
            .forEach((accessRule) => {
                sharingTextParts.push(
                    i18n.t('{{userOrGroup}} ({{accessLevel}})', {
                        userOrGroup: accessRule.displayName,
                        accessLevel: getAccessLevelString(accessRule.access),
                    })
                )
            })

        return sharingTextParts.length
            ? i18n.t('Shared with {{commaSeparatedListOfUsersAndGroups}}', {
                  commaSeparatedListOfUsersAndGroups:
                      formatList(sharingTextParts),
              })
            : i18n.t('Not shared with any users or groups')
    }

    return (
        <div
            className={cx('container', {
                expanded: isExpanded,
            })}
        >
            <div className="header" onClick={() => setIsExpanded(!isExpanded)}>
                <span className="title">
                    {getTranslatedString(type, 'unitTitle')}
                </span>
                {isExpanded ? (
                    <IconChevronUp24 color={colors.grey700} />
                ) : (
                    <IconChevronDown24 color={colors.grey700} />
                )}
            </div>
            {isExpanded && (
                <>
                    {dataIsLoading && (
                        <div className="loader">
                            <CircularLoader small />
                        </div>
                    )}
                    {data && (
                        <div className="content">
                            <p
                                className={cx('detailLine', {
                                    noDescription: !data.ao.displayDescription,
                                })}
                            >
                                {data.ao.displayDescription
                                    ? data.ao.displayDescription
                                    : i18n.t('No description')}
                            </p>
                            <div>
                                <p className="detailLine">
                                    <IconShare16 color={colors.grey700} />
                                    {getSharingSummary(data.ao)}
                                </p>
                                <p className="detailLine">
                                    <IconClock16 color={colors.grey700} />
                                    {i18n.t('Last updated {{time}}', {
                                        time: moment(
                                            data.ao.lastUpdated
                                        ).fromNow(),
                                    })}
                                </p>
                                <p className="detailLine">
                                    <IconUser16 color={colors.grey700} />
                                    {data.ao.createdBy?.displayName
                                        ? i18n.t(
                                              'Created {{time}} by {{author}}',
                                              {
                                                  time: moment(
                                                      data.ao.created
                                                  ).fromNow(),
                                                  author: data.ao.createdBy
                                                      .displayName,
                                              }
                                          )
                                        : i18n.t('Created {{time}}', {
                                              time: moment(
                                                  data.ao.created
                                              ).fromNow(),
                                          })}
                                </p>
                                <p className="detailLine">
                                    <IconView16 color={colors.grey700} />
                                    {i18n.t('Viewed {{count}} times', {
                                        count: data.dataStatistics.views,
                                        defaultValue: 'Viewed 1 time',
                                        defaultValue_plural:
                                            'Viewed {{count}} times',
                                    })}
                                </p>
                            </div>
                            <div className="subsection">
                                <span className="subsectionTitle">
                                    {i18n.t('Notifications')}
                                </span>
                                {data.ao.subscribed ? (
                                    <>
                                        <p className="subscriptionLabel">
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
                                            loading={unsubscribeIsLoading}
                                            onClick={unsubscribe}
                                        >
                                            {i18n.t('Unsubscribe')}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <p className="subscriptionLabel">
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
                                            loading={subscribeIsLoading}
                                            onClick={subscribe}
                                        >
                                            {i18n.t('Subscribe')}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
            <style jsx>{styles}</style>
        </div>
    )
})

AboutAOUnit.displayName = 'AboutUnit'

AboutAOUnit.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    renderId: PropTypes.number,
}

export default AboutAOUnit
