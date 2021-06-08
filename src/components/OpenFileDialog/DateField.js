import PropTypes from 'prop-types'
import React from 'react'

export const DateField = ({ date }) => {
    const d = new Date(date)
    const time = `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${(
        '0' + d.getDate()
    ).slice(-2)}`

    return <time dateTime={d.toISOString()}>{time}</time>
}

DateField.propTypes = {
    date: PropTypes.string.isRequired,
}

export default DateField
