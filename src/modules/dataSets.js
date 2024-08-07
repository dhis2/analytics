import i18n from '../locales/index.js'

export const REPORTING_RATE = 'REPORTING_RATE'
export const REPORTING_RATE_ON_TIME = 'REPORTING_RATE_ON_TIME'
export const ACTUAL_REPORTS = 'ACTUAL_REPORTS'
export const ACTUAL_REPORTS_ON_TIME = 'ACTUAL_REPORTS_ON_TIME'
export const EXPECTED_REPORTS = 'EXPECTED_REPORTS'

export const DATA_SETS_CONSTANTS = [
    {
        id: REPORTING_RATE,
        getName: () => i18n.t('Reporting rate'),
    },
    {
        id: REPORTING_RATE_ON_TIME,
        getName: () => i18n.t('Reporting rate on time'),
    },
    {
        id: ACTUAL_REPORTS,
        getName: () => i18n.t('Actual reports'),
    },
    {
        id: ACTUAL_REPORTS_ON_TIME,
        getName: () => i18n.t('Actual reports on time'),
    },
    {
        id: EXPECTED_REPORTS,
        getName: () => i18n.t('Expected reports'),
    },
]
