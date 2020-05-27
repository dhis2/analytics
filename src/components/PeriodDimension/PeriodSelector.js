import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Transfer, TabBar, Tab } from '@dhis2/ui-core'
import i18n from '@dhis2/d2-i18n'

import FixedPeriodFilter from './FixedPeriodFilter'
import RelativePeriodFilter from './RelativePeriodFilter'
import {
    MONTHS,
    getRelativePeriodsOptionsById,
} from './utils/RelativePeriodsGenerator'
import {
    MONTHLY,
    getFixedPeriodsOptionsById,
} from './utils/FixedPeriodsGenerator'
import styles from './styles/PeriodSelector.style'
import { TransferOption } from '../TransferOption'
import PeriodIcon from '../../assets/DimensionItemIcons/PeriodIcon'

const defaultRelativePeriodType = getRelativePeriodsOptionsById(MONTHS)
const defaultFixedPeriodType = getFixedPeriodsOptionsById(MONTHLY)
const defaultFixedPeriodYear = new Date().getFullYear()
const fixedPeriodConfig = year => ({
    offset: year - defaultFixedPeriodYear,
    filterFuturePeriods: false,
    reversePeriods: false,
})

// TODO: Refactor to functional component
class PeriodSelector extends Component {
    state = {
        allPeriods: defaultRelativePeriodType.getPeriods(),
        selectedPeriods: [],
        isRelative: true,
        relativeFilter: {
            periodType: {
                label: defaultRelativePeriodType.getName(),
                value: defaultRelativePeriodType.id,
            },
        },
        fixedFilter: {
            periodType: {
                label: defaultFixedPeriodType.getName(),
                value: defaultFixedPeriodType.id,
            },
            year: defaultFixedPeriodYear.toString(),
        },
    }

    constructor(props) {
        super(props)

        this.state.selectedPeriods = this.props.selectedItems.map(item => ({
            label: item.name,
            value: item.id,
            key: item.id,
        }))
    }

    onIsRelativeClick = isRelative => {
        if (this.state.isRelative !== isRelative) {
            this.setState({ isRelative })
            this.setState({
                allPeriods: isRelative
                    ? getRelativePeriodsOptionsById(
                          this.state.relativeFilter.periodType.value
                      ).getPeriods()
                    : getFixedPeriodsOptionsById(
                          this.state.fixedFilter.periodType.label
                      ).getPeriods(
                          fixedPeriodConfig(Number(this.state.fixedFilter.year))
                      ),
            })
        }
    }

    renderHeader = () => (
        <>
            <TabBar>
                <Tab
                    selected={this.state.isRelative}
                    onClick={() => this.onIsRelativeClick(true)}
                >
                    {i18n.t('Relative periods')}
                </Tab>
                <Tab
                    selected={!this.state.isRelative}
                    onClick={() => this.onIsRelativeClick(false)}
                >
                    {i18n.t('Fixed periods')}
                </Tab>
            </TabBar>
            <div className="filterContainer">
                {this.state.isRelative ? (
                    <RelativePeriodFilter
                        currentFilter={this.state.relativeFilter.periodType}
                        onSelectFilter={filter => {
                            this.setState({
                                relativeFilter: { periodType: filter },
                            })
                            this.setState({
                                allPeriods: getRelativePeriodsOptionsById(
                                    filter.value
                                ).getPeriods(),
                            })
                        }}
                    />
                ) : (
                    <FixedPeriodFilter
                        currentPeriodType={this.state.fixedFilter.periodType}
                        currentYear={this.state.fixedFilter.year}
                        onSelectPeriodType={periodType => {
                            this.onSelectFixedPeriods({
                                periodType,
                                year: this.state.fixedFilter.year,
                            })
                        }}
                        onSelectYear={year => {
                            this.onSelectFixedPeriods({
                                periodType: this.state.fixedFilter.periodType,
                                year,
                            })
                        }}
                    />
                )}
            </div>
            <style jsx>{styles}</style>
        </>
    )

    onSelectFixedPeriods = fixedFilter => {
        this.setState({
            fixedFilter,
            allPeriods: getFixedPeriodsOptionsById(
                fixedFilter.periodType.value
            ).getPeriods(fixedPeriodConfig(Number(fixedFilter.year))),
        })
    }

    renderEmptySelection = () => (
        <>
            <p className="emptySelection">{i18n.t('No periods selected')}</p>
            <style jsx>{styles}</style>
        </>
    )

    render = () => (
        <Transfer
            onChange={({ selected }) => {
                this.setState({ selectedPeriods: selected })
                this.props.onSelect(selected)
            }}
            selected={this.state.selectedPeriods}
            leftHeader={this.renderHeader()}
            enableOrderChange
            height="512px"
            optionsWidth="420px"
            selectedWidth="298px"
            selectedEmptyComponent={this.renderEmptySelection()}
            rightFooter={this.props.rightFooter}
            // TODO: Add rightHeader "Selected Periods" once the Transfer component supports this (https://github.com/dhis2/ui-core/issues/885)
        >
            {this.state.allPeriods.map(item => (
                <TransferOption
                    label={item.getName()}
                    value={item.id}
                    key={item.id}
                    icon={PeriodIcon}
                />
            ))}
        </Transfer>
    )
}

PeriodSelector.propTypes = {
    onSelect: PropTypes.func.isRequired,
    rightFooter: PropTypes.node,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
}

PeriodSelector.defaultProps = {
    selectedItems: [],
}

export default PeriodSelector
