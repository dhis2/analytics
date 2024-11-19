import { getNowInCalendar } from '@dhis2/multi-calendar-dates'
import { IconInfo16, TabBar, Tab, Transfer } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
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
import { getFixedPeriodsOptionsById } from './utils/fixedPeriods.js'
import { MONTHLY, QUARTERLY } from './utils/index.js'
import { getRelativePeriodsOptionsById } from './utils/relativePeriods.js'

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

const PeriodTransfer = ({
    onSelect,
    dataTest,
    selectedItems,
    rightFooter,
    excludedPeriodTypes,
    periodsSettings,
    infoBoxMessage,
    height = TRANSFER_HEIGHT,
}) => {
    const defaultRelativePeriodType = excludedPeriodTypes.includes(MONTHLY)
        ? getRelativePeriodsOptionsById(QUARTERLY)
        : getRelativePeriodsOptionsById(MONTHLY)
    const defaultFixedPeriodType = excludedPeriodTypes.includes(MONTHLY)
        ? getFixedPeriodsOptionsById(QUARTERLY, periodsSettings)
        : getFixedPeriodsOptionsById(MONTHLY, periodsSettings)

    const now = getNowInCalendar(periodsSettings.calendar)
    // use ".eraYear" rather than ".year" because in Ethiopian calendar, eraYear is what our users expect to see (for other calendars, it doesn't matter)
    // there is still a pending decision in Temporal regarding which era to use by default: https://github.com/js-temporal/temporal-polyfill/blob/9350ee7dd0d29f329fc097debf923a517c32f813/lib/calendar.ts#L1964
    const defaultFixedPeriodYear = now.eraYear || now.year

    const fixedPeriodConfig = (year) => ({
        offset: year - defaultFixedPeriodYear,
        filterFuturePeriods: false,
        reversePeriods: false,
    })

    const [allPeriods, setAllPeriods] = useState(
        defaultRelativePeriodType.getPeriods()
    )
    const [isRelative, setIsRelative] = useState(true)
    const [relativeFilter, setRelativeFilter] = useState({
        periodType: defaultRelativePeriodType.id,
    })
    const [fixedFilter, setFixedFilter] = useState({
        periodType: defaultFixedPeriodType.id,
        year: defaultFixedPeriodYear.toString(),
    })

    const isActive = (value) => {
        const item = selectedItems.find((item) => item.id === value)
        return !item || item.isActive
    }

    const onIsRelativeClick = (state) => {
        if (state !== isRelative) {
            setIsRelative(state)
            setAllPeriods(
                state
                    ? getRelativePeriodsOptionsById(
                          relativeFilter.periodType
                      ).getPeriods()
                    : getFixedPeriodsOptionsById(
                          fixedFilter.periodType,
                          periodsSettings
                      ).getPeriods(fixedPeriodConfig(Number(fixedFilter.year)))
            )
        }
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
                        currentFilter={relativeFilter.periodType}
                        onSelectFilter={(filter) => {
                            setRelativeFilter({ periodType: filter })
                            setAllPeriods(
                                getRelativePeriodsOptionsById(
                                    filter
                                ).getPeriods()
                            )
                        }}
                        dataTest={`${dataTest}-relative-period-filter`}
                        excludedPeriodTypes={excludedPeriodTypes}
                    />
                ) : (
                    <FixedPeriodFilter
                        currentPeriodType={fixedFilter.periodType}
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
                        excludedPeriodTypes={excludedPeriodTypes}
                    />
                )}
            </div>
            <style jsx>{styles}</style>
        </>
    )

    const onSelectFixedPeriods = (filter) => {
        setFixedFilter(filter)

        if (filter.year.match(/[0-9]{4}/)) {
            setAllPeriods(
                getFixedPeriodsOptionsById(
                    filter.periodType,
                    periodsSettings
                ).getPeriods(
                    fixedPeriodConfig(Number(filter.year)),
                    periodsSettings
                )
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

PeriodTransfer.defaultProps = {
    selectedItems: [],
    excludedPeriodTypes: [],
    periodsSettings: {
        calendar: 'gregory',
        locale: 'en',
    },
}

PeriodTransfer.propTypes = {
    onSelect: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    excludedPeriodTypes: PropTypes.arrayOf(PropTypes.string),
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
    height: PropTypes.string,
}

export default PeriodTransfer
