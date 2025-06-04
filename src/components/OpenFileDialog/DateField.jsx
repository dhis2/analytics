import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'

export const DateField = ({ date }) => {
    const d = new Date(date)

    return <time dateTime={d.toISOString()}>{moment(date).format('L')}</time>
}

DateField.propTypes = {
    date: PropTypes.string.isRequired,
}

export default DateField
