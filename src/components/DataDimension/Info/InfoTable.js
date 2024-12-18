import { useConfig, useTimeZoneConversion } from '@dhis2/app-runtime'
import { Center, CircularLoader } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { REPORTING_RATE } from '../../../modules/dataSets.js' // data sets
import {
    DIMENSION_TYPE_DATA_ELEMENT, // data element totals
    DIMENSION_TYPE_DATA_ELEMENT_OPERAND, // data element details
    DIMENSION_TYPE_INDICATOR,
    DIMENSION_TYPE_PROGRAM_ATTRIBUTE, // event data items
    DIMENSION_TYPE_PROGRAM_DATA_ELEMENT, // event data items
    DIMENSION_TYPE_PROGRAM_INDICATOR,
} from '../../../modules/dataTypes.js'
import { useDataDimensionContext } from '../DataDimension.js'
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

const renderMaintenanceLink = ({ baseUrl, authorities, type, id }) => {
    const maintenanceAppAuthority = 'M_dhis-web-maintenance'
    const canOpenMaintenanceApp = Array.isArray(authorities)
        ? authorities.includes(maintenanceAppAuthority)
        : authorities.has(maintenanceAppAuthority)

    const maintenanceUrlMap = {
        [DIMENSION_TYPE_INDICATOR]: '/edit/indicatorSection/indicator/',
        [DIMENSION_TYPE_DATA_ELEMENT]: '/edit/dataElementSection/dataElement/',
        [DIMENSION_TYPE_DATA_ELEMENT_OPERAND]:
            '/edit/dataElementSection/dataElement/',
        [DIMENSION_TYPE_PROGRAM_ATTRIBUTE]:
            '/edit/programSection/trackedEntityAttribute/',
        [DIMENSION_TYPE_PROGRAM_DATA_ELEMENT]:
            '/edit/dataElementSection/dataElement/',
        [DIMENSION_TYPE_PROGRAM_INDICATOR]:
            '/edit/indicatorSection/programIndicator/',
        [REPORTING_RATE]: '/edit/dataSetSection/dataSet/',
    }

    // not everyone has access to Maintenance app
    // calculations don't have a page in Maintenance
    if (!canOpenMaintenanceApp || !maintenanceUrlMap[type]) {
        return null
    }

    const maintenanceUrl = new URL(
        `dhis-web-maintenance/index.html#${maintenanceUrlMap[type]}${id}`,
        baseUrl === '..'
            ? window.location.href.split('dhis-web-data-visualizer/')[0]
            : `${baseUrl}/`
    ).href

    return (
        <>
            <tr>
                <th>{i18n.t('Maintenance link')}</th>
                <td>
                    <a href={maintenanceUrl} target="_blank" rel="noreferrer">
                        {i18n.t('Open in Maintenance app')}
                    </a>
                </td>
            </tr>
            <style jsx>{styles}</style>
        </>
    )
}

export const InfoTable = ({ type, data, error, loading, children }) => {
    const { fromServerDate } = useTimeZoneConversion()
    const { baseUrl } = useConfig()
    const { currentUser } = useDataDimensionContext()

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
                            {renderMaintenanceLink({
                                baseUrl,
                                authorities: currentUser?.authorities,
                                type,
                                id: data.id,
                            })}
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
    error: PropTypes.string,
    loading: PropTypes.bool,
    type: PropTypes.string,
}
