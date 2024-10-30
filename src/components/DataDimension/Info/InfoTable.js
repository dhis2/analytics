import { useTimeZoneConversion } from '@dhis2/app-runtime'
import { Center, CircularLoader } from '@dhis2/ui'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import styles from './styles/InfoPopover.style.js'

export const getCommonFields = (displayNameProp) =>
    `id,code,created,lastUpdated,createdBy,${displayNameProp}~rename(displayName),displayDescription`

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
                            <tr>
                                <th>{i18n.t('Code')}</th>
                                <td>{data.code}</td>
                            </tr>
                            <tr>
                                <th>{i18n.t('Description')}</th>
                                <td>{data.displayDescription}</td>
                            </tr>
                            <tr>
                                <th>{i18n.t('Created by')}</th>
                                <td>{data.createdBy.displayName}</td>
                            </tr>
                            <tr>
                                <th>{i18n.t('Last updated')}</th>
                                <td>
                                    {`${moment(
                                        fromServerDate(data.lastUpdated)
                                    ).fromNow()} (${moment(
                                        fromServerDate(data.lastUpdated)
                                    ).format('YYYY-MM-DD')})`}
                                </td>
                            </tr>
                            {children}
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
