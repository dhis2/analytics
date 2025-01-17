import { useTimeZoneConversion } from '@dhis2/app-runtime'
import { Center, CircularLoader } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import {
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM, // calculation
} from '../../../modules/dataTypes.js'
import styles from './styles/InfoPopover.style.js'

export const getCommonFields = (displayNameProp) =>
    `attributeValues[attribute[id,displayName],value],code,created,createdBy,${displayNameProp}~rename(displayName),displayDescription,href,id,lastUpdated`

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

export const InfoTable = ({ dataType, data, error, loading, children }) => {
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
            {error && (
                <div className="error">
                    <span>
                        {i18n.t(
                            'There was a problem loading information for this data item.'
                        )}
                    </span>
                </div>
            )}
            {data && (
                <>
                    <table className="data-table">
                        <tbody>
                            <tr>
                                <th>{i18n.t('Name')}</th>
                                <td>{data.displayName}</td>
                            </tr>
                            {children}
                            {dataType !==
                            DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM ? (
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
                            ) : (
                                data.displayDescription && (
                                    <tr>
                                        <th>{i18n.t('Description')}</th>
                                        <td>
                                            <div className="content-wrap">
                                                {data.displayDescription}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                            {dataType !==
                            DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM ? (
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
                            ) : (
                                data.code && (
                                    <tr>
                                        <th>{i18n.t('Code')}</th>
                                        <td>{data.code}</td>
                                    </tr>
                                )
                            )}
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
                            {data.attributeValues.map(
                                ({ attribute, value }) => (
                                    <tr key={attribute.id}>
                                        <th>{attribute.displayName}</th>
                                        <td>{value}</td>
                                    </tr>
                                )
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
    dataType: PropTypes.string,
    error: PropTypes.string,
    loading: PropTypes.bool,
}
