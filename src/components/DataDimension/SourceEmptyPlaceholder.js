import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import {
    DIMENSION_TYPE_DATA_ELEMENT,
    DIMENSION_TYPE_DATA_SET,
    DIMENSION_TYPE_EVENT_DATA_ITEM,
    DIMENSION_TYPE_PROGRAM_INDICATOR,
    DIMENSION_TYPE_INDICATOR,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
} from '../../modules/dataTypes.js'
import styles from './styles/EmptyPlaceholder.style.js'

export const SourceEmptyPlaceholder = ({
    loading,
    searchTerm,
    options,
    noItemsMessage,
    dataType,
    dataTest,
}) => {
    let message = ''
    if (!loading && !options.length && !searchTerm) {
        if (noItemsMessage) {
            message = noItemsMessage
        } else {
            switch (dataType) {
                case DIMENSION_TYPE_INDICATOR:
                    message = i18n.t('No indicators found')
                    break
                case DIMENSION_TYPE_DATA_ELEMENT:
                    message = i18n.t('No data elements found')
                    break
                case DIMENSION_TYPE_DATA_SET:
                    message = i18n.t('No data sets found')
                    break
                case DIMENSION_TYPE_EVENT_DATA_ITEM:
                    message = i18n.t('No event data items found')
                    break
                case DIMENSION_TYPE_PROGRAM_INDICATOR:
                    message = i18n.t('No program indicators found')
                    break
                case DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM:
                    message = i18n.t('No calculations found')
                    break
                default:
                    message = i18n.t('No data')
                    break
            }
        }
    } else if (!loading && !options.length && searchTerm) {
        switch (dataType) {
            case DIMENSION_TYPE_INDICATOR:
                message = i18n.t('No indicators found for "{{- searchTerm}}"', {
                    searchTerm,
                })
                break
            case DIMENSION_TYPE_DATA_ELEMENT:
                message = i18n.t(
                    'No data elements found for "{{- searchTerm}}"',
                    {
                        searchTerm,
                    }
                )
                break
            case DIMENSION_TYPE_DATA_SET:
                message = i18n.t('No data sets found for "{{- searchTerm}}"', {
                    searchTerm,
                })
                break
            case DIMENSION_TYPE_EVENT_DATA_ITEM:
                message = i18n.t(
                    'No event data items found for "{{- searchTerm}}"',
                    { searchTerm }
                )
                break
            case DIMENSION_TYPE_PROGRAM_INDICATOR:
                message = i18n.t(
                    'No program indicators found for "{{- searchTerm}}"',
                    { searchTerm }
                )
                break
            case DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM:
                message = i18n.t(
                    'No calculations found for "{{- searchTerm}}"',
                    { searchTerm }
                )
                break
            default:
                message = i18n.t('Nothing found for "{{- searchTerm}}"', {
                    searchTerm,
                })
                break
        }
    }
    return (
        message && (
            <>
                <p className="empty-list" data-test={dataTest}>
                    {message}
                </p>
                <style jsx>{styles}</style>
            </>
        )
    )
}

SourceEmptyPlaceholder.propTypes = {
    dataTest: PropTypes.string,
    dataType: PropTypes.string,
    loading: PropTypes.bool,
    noItemsMessage: PropTypes.string,
    options: PropTypes.array,
    searchTerm: PropTypes.string,
}
