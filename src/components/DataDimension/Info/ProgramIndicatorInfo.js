import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { getCommonFields, InfoTable } from './InfoTable.js'
import styles from './styles/InfoPopover.style.js'

const programIndicatorQuery = {
    programIndicator: {
        resource: 'programIndicators',
        id: ({ id }) => id,
        params: ({ displayNameProp }) => ({
            fields: `${getCommonFields(displayNameProp)},expression,filter`,
        }),
    },
}

export const ProgramIndicatorInfo = ({ id, displayNameProp }) => {
    const { loading, error, data } = useDataQuery(programIndicatorQuery, {
        variables: { id, displayNameProp },
    })

    return (
        <>
            <InfoTable
                data={data?.programIndicator}
                loading={loading}
                error={error}
            >
                <tr>
                    <th>{i18n.t('Expression')}</th>
                    <td className="code">
                        {data?.programIndicator.expression}
                    </td>
                </tr>
            </InfoTable>
            <style jsx>{styles}</style>
        </>
    )
}

ProgramIndicatorInfo.propTypes = {
    displayNameProp: PropTypes.string,
    id: PropTypes.string,
}
