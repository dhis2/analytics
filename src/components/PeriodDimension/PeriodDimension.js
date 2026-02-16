import { useConfig, useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions.js'
import PeriodTransfer from './PeriodTransfer.js'
import { useDataOutputPeriodTypes } from './useDataOutputPeriodTypes.js'

const userSettingsQuery = {
    userSettings: {
        resource: 'userSettings',
        params: {
            key: ['keyUiLocale'],
        },
    },
}

const SELECTED_PERIODS_PROP_DEFAULT = []

const PeriodDimension = ({
    onSelect,
    selectedPeriods = SELECTED_PERIODS_PROP_DEFAULT,
    rightFooter,
    excludedPeriodTypes,
    infoBoxMessage,
    height,
}) => {
    const config = useConfig()
    const { systemInfo } = config
    const userSettingsResult = useDataQuery(userSettingsQuery)

    const { supportsEnabledPeriodTypes, enabledPeriodTypesData } =
        useDataOutputPeriodTypes()

    const { calendar = 'gregory' } = systemInfo
    const { data: { userSettings: { keyUiLocale: locale } = {} } = {} } =
        userSettingsResult

    const periodsSettings = { calendar, locale }

    const selectPeriods = (periods) => {
        onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: periods,
        })
    }
    return (
        <PeriodTransfer
            onSelect={selectPeriods}
            selectedItems={selectedPeriods}
            infoBoxMessage={infoBoxMessage}
            rightFooter={rightFooter}
            dataTest={'period-dimension'}
            excludedPeriodTypes={excludedPeriodTypes}
            periodsSettings={periodsSettings}
            height={height}
            enabledPeriodTypesData={enabledPeriodTypesData}
            supportsEnabledPeriodTypes={supportsEnabledPeriodTypes}
        />
    )
}

PeriodDimension.propTypes = {
    onSelect: PropTypes.func.isRequired,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
    height: PropTypes.string,
    infoBoxMessage: PropTypes.string,
    rightFooter: PropTypes.node,
    selectedPeriods: PropTypes.array,
}

export default PeriodDimension
