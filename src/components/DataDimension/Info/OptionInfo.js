import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const optionQuery = {
    option: {
        resource: 'options',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(
                displayNameProp
            )},optionSet[displayName]`,
        }),
    },
}

export const OptionInfo = ({ type, id, displayNameProp }) => {
    const { loading, error, data } = useDataQuery(optionQuery, {
        variables: { id: id.split('.').reverse()[0], displayNameProp },
    })

    return (
        <>
            <InfoTable
                dataType={type}
                data={data?.option}
                loading={loading}
                error={error}
            >
                {data?.option.optionSet && (
                    <tr>
                        <th>{i18n.t('Option set')}</th>
                        <td>{data.option.optionSet.displayName}</td>
                    </tr>
                )}
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )
}

OptionInfo.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
}
