/* These types match the types in the backend
  https://github.com/dhis2/dhis2-core/blob/master/dhis-2/dhis-api/src/main/java/org/hisp/dhis/common/ValueType.java
*/

import i18n from '../locales/index.js'

export const VALUE_TYPE_TEXT = 'TEXT'
export const VALUE_TYPE_LONG_TEXT = 'LONG_TEXT'
export const VALUE_TYPE_MULTI_TEXT = 'MULTI_TEXT'
export const VALUE_TYPE_LETTER = 'LETTER'
export const VALUE_TYPE_PHONE_NUMBER = 'PHONE_NUMBER'
export const VALUE_TYPE_EMAIL = 'EMAIL'
export const VALUE_TYPE_BOOLEAN = 'BOOLEAN'
export const VALUE_TYPE_TRUE_ONLY = 'TRUE_ONLY'
export const VALUE_TYPE_DATE = 'DATE'
export const VALUE_TYPE_DATETIME = 'DATETIME'
export const VALUE_TYPE_TIME = 'TIME'
export const VALUE_TYPE_NUMBER = 'NUMBER'
export const VALUE_TYPE_UNIT_INTERVAL = 'UNIT_INTERVAL'
export const VALUE_TYPE_PERCENTAGE = 'PERCENTAGE'
export const VALUE_TYPE_INTEGER = 'INTEGER'
export const VALUE_TYPE_INTEGER_POSITIVE = 'INTEGER_POSITIVE'
export const VALUE_TYPE_INTEGER_NEGATIVE = 'INTEGER_NEGATIVE'
export const VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE = 'INTEGER_ZERO_OR_POSITIVE'
export const VALUE_TYPE_TRACKER_ASSOCIATE = 'TRACKER_ASSOCIATE'
export const VALUE_TYPE_USERNAME = 'USERNAME'
export const VALUE_TYPE_COORDINATE = 'COORDINATE'
export const VALUE_TYPE_ORGANISATION_UNIT = 'ORGANISATION_UNIT'
export const VALUE_TYPE_REFERENCE = 'REFERENCE'
export const VALUE_TYPE_AGE = 'AGE'
export const VALUE_TYPE_URL = 'URL'
export const VALUE_TYPE_FILE_RESOURCE = 'FILE_RESOURCE'
export const VALUE_TYPE_IMAGE = 'IMAGE'
export const VALUE_TYPE_GEOJSON = 'GEOJSON'

export const valueTypeDisplayNames = {
    [VALUE_TYPE_TEXT]: i18n.t('Text'),
    [VALUE_TYPE_LONG_TEXT]: i18n.t('Long text'),
    [VALUE_TYPE_MULTI_TEXT]: i18n.t('Multi text'),
    [VALUE_TYPE_LETTER]: i18n.t('Letter'),
    [VALUE_TYPE_PHONE_NUMBER]: i18n.t('Phone number'),
    [VALUE_TYPE_EMAIL]: i18n.t('Email'),
    [VALUE_TYPE_BOOLEAN]: i18n.t('Yes/No'),
    [VALUE_TYPE_TRUE_ONLY]: i18n.t('Yes Only'),
    [VALUE_TYPE_DATE]: i18n.t('Date'),
    [VALUE_TYPE_DATETIME]: i18n.t('Date & Time'),
    [VALUE_TYPE_TIME]: i18n.t('Time'),
    [VALUE_TYPE_NUMBER]: i18n.t('Number'),
    [VALUE_TYPE_UNIT_INTERVAL]: i18n.t('Unit interval'),
    [VALUE_TYPE_PERCENTAGE]: i18n.t('Percentage'),
    [VALUE_TYPE_INTEGER]: i18n.t('Integer'),
    [VALUE_TYPE_INTEGER_POSITIVE]: i18n.t('Positive Integer'),
    [VALUE_TYPE_INTEGER_NEGATIVE]: i18n.t('Negative Integer'),
    [VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE]: i18n.t('Positive or Zero Integer'),
    [VALUE_TYPE_TRACKER_ASSOCIATE]: i18n.t('Tracker Associate'),
    [VALUE_TYPE_USERNAME]: i18n.t('Username'),
    [VALUE_TYPE_COORDINATE]: i18n.t('Coordinate'),
    [VALUE_TYPE_ORGANISATION_UNIT]: i18n.t('Organisation unit'),
    [VALUE_TYPE_REFERENCE]: i18n.t('Reference'),
    [VALUE_TYPE_AGE]: i18n.t('Age'),
    [VALUE_TYPE_URL]: i18n.t('URL'),
    [VALUE_TYPE_FILE_RESOURCE]: i18n.t('File'),
    [VALUE_TYPE_IMAGE]: i18n.t('Image'),
    [VALUE_TYPE_GEOJSON]: i18n.t('GeoJSON'),
}

const NUMERIC_VALUE_TYPES = [
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_UNIT_INTERVAL,
    VALUE_TYPE_PERCENTAGE,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
]

const BOOLEAN_VALUE_TYPES = [VALUE_TYPE_BOOLEAN, VALUE_TYPE_TRUE_ONLY]

const CUMULATIVE_VALUE_TYPES = [
    VALUE_TYPE_NUMBER,
    VALUE_TYPE_INTEGER,
    VALUE_TYPE_INTEGER_POSITIVE,
    VALUE_TYPE_INTEGER_NEGATIVE,
    VALUE_TYPE_INTEGER_ZERO_OR_POSITIVE,
    ...BOOLEAN_VALUE_TYPES,
]

export const isCumulativeValueType = (type) =>
    CUMULATIVE_VALUE_TYPES.includes(type)
export const isNumericValueType = (type) => NUMERIC_VALUE_TYPES.includes(type)
export const isBooleanValueType = (type) => BOOLEAN_VALUE_TYPES.includes(type)
