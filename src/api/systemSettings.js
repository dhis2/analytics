import { useDataQuery } from '@dhis2/app-runtime'

const getSystemSettingsQuery = keys => ({
    systemSettings: {
        resource: 'systemSettings',
        params: {
            key: keys,
        },
    },
})

export const apiGetSystemSettings = keys =>
    useDataQuery(getSystemSettingsQuery(keys))
