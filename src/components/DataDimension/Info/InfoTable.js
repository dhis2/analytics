import { useTimeZoneConversion } from '@dhis2/app-runtime'
import { Center, CircularLoader } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import styles from './styles/InfoPopover.style.js'

export const getCommonFields = (displayNameProp) =>
    `attributeValues[attribute[id,displayName]],code,created,createdBy,${displayNameProp}~rename(displayName),displayDescription,href,id,lastUpdated`

export const capitalizeText = (text) =>
    text && text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

export const sentenceCaseText = (text) =>
    text && capitalizeText(text.replaceAll('_', ' ').toLowerCase())

export const renderDataSets = (dataSets) => {
    if (dataSets.length === 0) {
        return (
            <>
                <span className="none">{i18n.t('None')}</span>
                <style jsx>{styles}</style>
            </>
        )
    } else if (dataSets.length === 1) {
        return dataSets[0].displayName
    } else {
        return (
            <>
                <div className="content-wrap">
                    <ul>
                        {dataSets.map(({ id, displayName }) => (
                            <li key={id}>{displayName}</li>
                        ))}
                    </ul>
                </div>
                <style jsx>{styles}</style>
            </>
        )
    }
}

export const renderGroupMemberships = (groups) => {
    if (groups.length === 0) {
        return (
            <>
                <span className="none">{i18n.t('None')}</span>
                <style jsx>{styles}</style>
            </>
        )
    } else if (groups.length === 1) {
        return groups[0].displayName
    } else {
        return (
            <>
                <div className="content-wrap">
                    <ul>
                        {groups.map(({ id, displayName }) => (
                            <li key={id}>{displayName}</li>
                        ))}
                    </ul>
                </div>
                <style jsx>{styles}</style>
            </>
        )
    }
}

export const renderHumanReadableExpression = (expressionData) => (
    <>
        {expressionData.status === 'ERROR' ? (
            <span className="none">{expressionData.message}</span>
        ) : (
            <span className="code">{expressionData.description}</span>
        )}
        <style jsx>{styles}</style>
    </>
)

export const renderLegendSets = (legendSets) => {
    return legendSets.length === 1 ? (
        legendSets[0].displayName
    ) : (
        <>
            <div className="content-wrap">
                <ul>
                    {legendSets.map(({ id, displayName }) => (
                        <li key={id}>{displayName}</li>
                    ))}
                </ul>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

export const InfoTable = ({ data, error, loading, children }) => {
    const { fromServerDate } = useTimeZoneConversion()

    return (
        <>
            {loading && (
                <div className="loader">
                    <Center>
                        <CircularLoader small />
                    </Center>
                </div>
            )}
            {error && 'some error occured'}
            {data && (
                <>
                    <table className="data-table">
                        <tbody>
                            <tr>
                                <th>{i18n.t('Name')}</th>
                                <td>{data.displayName}</td>
                            </tr>
                            {children}
                            <tr>
                                <th>{i18n.t('Description')}</th>
                                <td>
                                    {data.displayDescription ? (
                                        <div className="content-wrap">
                                            {data.displayDescription}
                                        </div>
                                    ) : (
                                        <span className="none">
                                            {i18n.t('None')}
                                        </span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>{i18n.t('Code')}</th>
                                <td>
                                    {data.code ? (
                                        data.code
                                    ) : (
                                        <span className="none">
                                            {i18n.t('None')}
                                        </span>
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <th>{i18n.t('ID')}</th>
                                <td>
                                    <span className="code">{data.id}</span>
                                </td>
                            </tr>
                            <tr>
                                <th>{i18n.t('Last updated date')}</th>
                                <td>
                                    {`${moment(
                                        fromServerDate(data.lastUpdated)
                                    ).fromNow()} (${moment(
                                        fromServerDate(data.lastUpdated)
                                    ).format('YYYY-MM-DD')})`}
                                </td>
                            </tr>
                            <tr>
                                <th>{i18n.t('Created date')}</th>
                                <td>
                                    {`${moment(
                                        fromServerDate(data.created)
                                    ).fromNow()} (${moment(
                                        fromServerDate(data.created)
                                    ).format('YYYY-MM-DD')})`}
                                </td>
                            </tr>
                            <tr>
                                <th>{i18n.t('Created by')}</th>
                                <td>{`${data.createdBy.displayName}, ${data.createdBy.username}`}</td>
                            </tr>
                            <tr>
                                <th>{i18n.t('API link')}</th>
                                <td>
                                    <a
                                        href={data.href}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {i18n.t('Open in API')}
                                    </a>
                                </td>
                            </tr>
                            {Boolean(data.attributeValues.length) && (
                                <tr>
                                    <th>{i18n.t('Custom attributes')}</th>
                                    <td>
                                        <ul>
                                            {data.attributeValues.map(
                                                ({ attribute }) => (
                                                    <li key={attribute.id}>
                                                        {attribute.displayName}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </>
            )}
            <style jsx>{styles}</style>
        </>
    )
}

InfoTable.propTypes = {
    children: PropTypes.node,
    data: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
}
