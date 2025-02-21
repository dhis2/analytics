import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const optionQuery = {
    option: {
        resource: 'options',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: getCommonFields(displayNameProp),
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
            />
            <style jsx>{styles}</style>
        </>
    )
}

OptionInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
    type: PropTypes.string,
}
