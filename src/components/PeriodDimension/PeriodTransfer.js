import { getNowInCalendar } from '@dhis2/multi-calendar-dates'
import { IconInfo16, NoticeBox, TabBar, Tab, Transfer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState, useMemo } from 'react'
import PeriodIcon from '../../assets/DimensionItemIcons/PeriodIcon.js' //TODO: Reimplement the icon.js
import i18n from '../../locales/index.js'
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper.js'
import styles from '../styles/DimensionSelector.style.js'
import { TransferOption } from '../TransferOption.js'
import FixedPeriodFilter from './FixedPeriodFilter.js'
import RelativePeriodFilter from './RelativePeriodFilter.js'
import {
    applyDisplayLabelOverrides,
    applyFixedPeriodTypeDisplayLabels,
    filterEnabledFixedPeriodTypes,
    filterEnabledRelativePeriodTypes,
} from './utils/enabledPeriodTypes.js'
import { getFixedPeriodsOptions } from './utils/fixedPeriods.js'
import { MONTHLY, QUARTERLY, filterPeriodTypesById } from './utils/index.js'
import { getRelativePeriodsOptions } from './utils/relativePeriods.js'

const RightHeader = ({ infoBoxMessage }) => (
    <>
        <p className="rightHeader">{i18n.t('Selected Periods')}</p>
        {infoBoxMessage && (
            <div className="info-container">
                <div>
                    <IconInfo16 />
                </div>
                <span className="info-text">{infoBoxMessage}</span>
            </div>
        )}
        <style jsx>{styles}</style>
    </>
)

RightHeader.propTypes = {
    infoBoxMessage: PropTypes.string,
}
const SELECTED_ITEMS_PROP_DEFAULT = []
const EXCLUDED_PERIOD_TYPES_PROP_DEFAULT = []
const PERIODS_SETTINGS_PROP_DEFAULT = { calendar: 'gregory', locale: 'en' }

const PeriodTransfer = ({
    onSelect,
    dataTest,
    selectedItems = SELECTED_ITEMS_PROP_DEFAULT,
    rightFooter,
    excludedPeriodTypes = EXCLUDED_PERIOD_TYPES_PROP_DEFAULT,
    periodsSettings = PERIODS_SETTINGS_PROP_DEFAULT,
    infoBoxMessage,
    height = TRANSFER_HEIGHT,
    enabledPeriodTypesData = null,
    supportsEnabledPeriodTypes = false,
}) => {
    const { filteredFixedOptions, filteredRelativeOptions } = useMemo(() => {
        if (supportsEnabledPeriodTypes && enabledPeriodTypesData) {
            const { enabledTypes, financialYearStart, financialYearDisplayLabel, weeklyDisplayLabel, metaData } = enabledPeriodTypesData

            const filteredFixed = applyFixedPeriodTypeDisplayLabels(
                filterEnabledFixedPeriodTypes(
                    getFixedPeriodsOptions(periodsSettings),
                    enabledTypes
                ),
                enabledTypes
            )

            const filteredRelative = applyDisplayLabelOverrides(
                filterEnabledRelativePeriodTypes(
                    getRelativePeriodsOptions(),
                    enabledTypes,
                    financialYearStart
                ),
                { financialYearDisplayLabel, weeklyDisplayLabel, metaData }
            )

            return {
                filteredFixedOptions: filteredFixed,
                filteredRelativeOptions: filteredRelative,
            }
        } else {
            const allFixed = getFixedPeriodsOptions(periodsSettings)
            const allRelative = getRelativePeriodsOptions()

            return {
                filteredFixedOptions: filterPeriodTypesById(
                    allFixed,
                    excludedPeriodTypes
                ),
                filteredRelativeOptions: filterPeriodTypesById(
                    allRelative,
                    excludedPeriodTypes
                ),
            }
        }
    }, [
        supportsEnabledPeriodTypes,
        enabledPeriodTypesData,
        excludedPeriodTypes,
        periodsSettings,
    ])

    const analysisRelativePeriod =
        enabledPeriodTypesData?.analysisRelativePeriod

    const defaultRelativePeriodType = (() => {
        if (analysisRelativePeriod) {
            const match = filteredRelativeOptions.find((opt) =>
                opt.getPeriods().some((p) => p.id === analysisRelativePeriod)
            )
            if (match) {
                return match
            }
        }
        return (
            filteredRelativeOptions.find((opt) => opt.id === MONTHLY) ||
            filteredRelativeOptions.find((opt) => opt.id === QUARTERLY) ||
            filteredRelativeOptions[0]
        )
    })()

    const defaultFixedPeriodType =
        filteredFixedOptions.find((opt) => opt.id === MONTHLY) ||
        filteredFixedOptions.find((opt) => opt.id === QUARTERLY) ||
        filteredFixedOptions[0]

    const now = getNowInCalendar(periodsSettings.calendar)
    // use ".eraYear" rather than ".year" because in Ethiopian calendar, eraYear is what our users expect to see (for other calendars, it doesn't matter)
    // there is still a pending decision in Temporal regarding which era to use by default: https://github.com/js-temporal/temporal-polyfill/blob/9350ee7dd0d29f329fc097debf923a517c32f813/lib/calendar.ts#L1964
    const defaultFixedPeriodYear = now.eraYear || now.year

    const fixedPeriodConfig = (year) => ({
        offset: year - defaultFixedPeriodYear,
        filterFuturePeriods: false,
        reversePeriods: false,
    })

    const [userPeriods, setUserPeriods] = useState(null)
    const [isRelative, setIsRelative] = useState(true)
    const [relativeFilter, setRelativeFilter] = useState({
        periodType: defaultRelativePeriodType?.id || '',
    })
    const [fixedFilter, setFixedFilter] = useState({
        periodType: defaultFixedPeriodType?.id || '',
        year: defaultFixedPeriodYear.toString(),
    })

    const effectiveRelativeFilterType = filteredRelativeOptions.some(
        (opt) => opt.id === relativeFilter.periodType
    )
        ? relativeFilter.periodType
        : defaultRelativePeriodType?.id || ''

    const effectiveFixedFilterType = filteredFixedOptions.some(
        (opt) => opt.id === fixedFilter.periodType
    )
        ? fixedFilter.periodType
        : defaultFixedPeriodType?.id || ''

    const prevEffectiveRelativeRef = useRef(effectiveRelativeFilterType)
    const prevEffectiveFixedRef = useRef(effectiveFixedFilterType)

    if (prevEffectiveRelativeRef.current !== effectiveRelativeFilterType) {
        prevEffectiveRelativeRef.current = effectiveRelativeFilterType
        if (relativeFilter.periodType !== effectiveRelativeFilterType) {
            setRelativeFilter({ periodType: effectiveRelativeFilterType })
        }
        if (isRelative) {
            setUserPeriods(null)
        }
    }

    if (prevEffectiveFixedRef.current !== effectiveFixedFilterType) {
        prevEffectiveFixedRef.current = effectiveFixedFilterType
        if (fixedFilter.periodType !== effectiveFixedFilterType) {
            setFixedFilter((prev) => ({
                ...prev,
                periodType: effectiveFixedFilterType,
            }))
        }
        if (!isRelative) {
            setUserPeriods(null)
        }
    }

    const derivedPeriods = useMemo(() => {
        if (isRelative) {
            const opt = filteredRelativeOptions.find(
                (o) => o.id === effectiveRelativeFilterType
            )
            return opt?.getPeriods() || []
        } else {
            const opt = filteredFixedOptions.find(
                (o) => o.id === effectiveFixedFilterType
            )
            return (
                opt?.getPeriods(fixedPeriodConfig(Number(fixedFilter.year))) ||
                []
            )
        }
    }, [
        isRelative,
        effectiveRelativeFilterType,
        effectiveFixedFilterType,
        filteredRelativeOptions,
        filteredFixedOptions,
        fixedFilter.year,
    ])

    const allPeriods = userPeriods !== null ? userPeriods : derivedPeriods

    const isActive = (value) => {
        const item = selectedItems.find((item) => item.id === value)
        return !item || item.isActive
    }

    const onIsRelativeClick = (state) => {
        if (state !== isRelative) {
            setIsRelative(state)
            setUserPeriods(null)
        }
    }

    if (enabledPeriodTypesData?.noEnabledTypes) {
        return (
            <NoticeBox warning title={i18n.t('No period types available')}>
                {i18n.t(
                    'No period types are enabled in the system. Please contact your system administrator.'
                )}
            </NoticeBox>
        )
    }

    const renderLeftHeader = () => (
        <>
            <TabBar>
                <Tab
                    selected={isRelative}
                    onClick={() => onIsRelativeClick(true)}
                    dataTest={`${dataTest}-relative-periods-button`}
                >
                    {i18n.t('Relative periods')}
                </Tab>
                <Tab
                    selected={!isRelative}
                    onClick={() => onIsRelativeClick(false)}
                    dataTest={`${dataTest}-fixed-periods-button`}
                >
                    {i18n.t('Fixed periods')}
                </Tab>
            </TabBar>
            <div className="filterContainer">
                {isRelative ? (
                    <RelativePeriodFilter
                        currentFilter={effectiveRelativeFilterType}
                        onSelectFilter={(filter) => {
                            setRelativeFilter({ periodType: filter })
                            const selectedOption = filteredRelativeOptions.find(
                                (opt) => opt.id === filter
                            )
                            setUserPeriods(selectedOption?.getPeriods() || [])
                        }}
                        dataTest={`${dataTest}-relative-period-filter`}
                        availableOptions={filteredRelativeOptions}
                    />
                ) : (
                    <FixedPeriodFilter
                        currentPeriodType={effectiveFixedFilterType}
                        currentYear={fixedFilter.year}
                        onSelectPeriodType={(periodType) => {
                            onSelectFixedPeriods({
                                periodType,
                                year: fixedFilter.year,
                            })
                        }}
                        onSelectYear={(year) => {
                            onSelectFixedPeriods({
                                periodType: fixedFilter.periodType,
                                year,
                            })
                        }}
                        dataTest={`${dataTest}-fixed-period-filter`}
                        availableOptions={filteredFixedOptions}
                    />
                )}
            </div>
            <style jsx>{styles}</style>
        </>
    )

    const onSelectFixedPeriods = (filter) => {
        setFixedFilter(filter)

        if (filter.year.match(/[0-9]{4}/)) {
            const selectedOption = filteredFixedOptions.find(
                (opt) => opt.id === filter.periodType
            )
            setUserPeriods(
                selectedOption?.getPeriods(
                    fixedPeriodConfig(Number(filter.year))
                ) || []
            )
        }
    }

    const renderEmptySelection = () => (
        <>
            <p className="emptyList">{i18n.t('No periods selected')}</p>
            <style jsx>{styles}</style>
        </>
    )

    return (
        <Transfer
            onChange={({ selected }) => {
                const formattedItems = selected.map((id) => {
                    const matchingItem = [...allPeriods, ...selectedItems].find(
                        (item) => item.id === id
                    )

                    return {
                        id,
                        name: matchingItem.name,
                        isActive: matchingItem.isActive,
                    }
                })
                onSelect(formattedItems)
            }}
            selected={selectedItems.map((period) => period.id)}
            leftHeader={renderLeftHeader()}
            enableOrderChange
            height={height}
            optionsWidth={TRANSFER_OPTIONS_WIDTH}
            selectedWidth={TRANSFER_SELECTED_WIDTH}
            selectedEmptyComponent={renderEmptySelection()}
            rightHeader={<RightHeader infoBoxMessage={infoBoxMessage} />}
            rightFooter={rightFooter}
            options={[...allPeriods, ...selectedItems].map(({ id, name }) => ({
                label: name,
                value: id,
            }))}
            renderOption={({ value, ...props }) => (
                <TransferOption
                    {...props}
                    value={value}
                    active={isActive(value)}
                    icon={PeriodIcon}
                    dataTest={`${dataTest}-transfer-option`}
                />
            )}
            dataTest={`${dataTest}-transfer`}
        ></Transfer>
    )
}

PeriodTransfer.propTypes = {
    onSelect: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    enabledPeriodTypesData: PropTypes.shape({
        analysisRelativePeriod: PropTypes.string,
        enabledTypes: PropTypes.array,
        financialYearDisplayLabel: PropTypes.string,
        financialYearStart: PropTypes.string,
        noEnabledTypes: PropTypes.bool,
    }),
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
    height: PropTypes.string,
    infoBoxMessage: PropTypes.string,
    periodsSettings: PropTypes.shape({
        calendar: PropTypes.string,
        locale: PropTypes.string,
    }),
    rightFooter: PropTypes.node,
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            isActive: PropTypes.bool,
            name: PropTypes.string,
        })
    ),
    supportsEnabledPeriodTypes: PropTypes.bool,
}

export default PeriodTransfer
