import isArray from 'd2-utilizr/lib/isArray'
import isObject from 'd2-utilizr/lib/isObject'
import isString from 'd2-utilizr/lib/isString'

const MODULE = 'Data validator: '

function getMessage(text) {
    return MODULE + text
}

function validateHeader(header, error) {
    if (!isObject(header)) {
        error(getMessage('Header is not an object'))
    }

    if (header.meta) {
        if (!isString(header.name)) {
            error(getMessage('Header name is not a string'))
        }
    }
}

function validateRowValue(rowValue, error) {
    if (!isString(rowValue)) {
        error(getMessage('Row value is not a string'))
    }
}

function validateRow(row, headersLength, error) {
    if (!isArray(row)) {
        error(getMessage('Data row is not an array'))
    }

    if (row.length !== headersLength) {
        error(getMessage('Data row length is invalid'))
    }

    row.forEach(rowValue => validateRowValue(rowValue, error))
}

export default function({ data, error, warning }) {
    if (!isObject(data)) {
        error(getMessage('Data is not an object'))
    }

    // headers

    if (!isArray(data.headers)) {
        error(getMessage('Response headers is not an array'))
    }

    if (!data.headers.length > 1) {
        error(getMessage('At least two response headers required'))
    }

    data.headers.forEach(header => validateHeader(header, error))

    // meta data

    if (!isObject(data.metaData)) {
        error(getMessage('Metadata is not an object'))
    }

    if (!isObject(data.metaData.items)) {
        error(getMessage('Metadata items is not an object'))
    }

    if (!isObject(data.metaData.dimensions)) {
        error(getMessage('Metadata dimensions is not an object'))
    }

    // data

    if (!isArray(data.rows)) {
        warning(getMessage('Data rows is not an array'))
    }

    if (!data.rows.length) {
        warning(getMessage('No data rows provided'))
    }

    data.rows.forEach(row => validateRow(row, data.headers.length, error))

    return data
}
