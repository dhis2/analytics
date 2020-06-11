import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TabBar, Tab, Transfer } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

import FixedPeriodFilter from './FixedPeriodFilter'
import RelativePeriodFilter from './RelativePeriodFilter'
import { MONTHS, getRelativePeriodsOptionsById } from './utils/relativePeriods'
import { MONTHLY, getFixedPeriodsOptionsById } from './utils/fixedPeriods'
import styles from '../styles/DimensionSelector.style'
import { TransferOption } from '../TransferOption'
import PeriodIcon from '../../assets/DimensionItemIcons/PeriodIcon' //TODO: Reimplement the icon
import {
    TRANSFER_HEIGHT,
    TRANSFER_OPTIONS_WIDTH,
    TRANSFER_SELECTED_WIDTH,
} from '../../modules/dimensionSelectorHelper'

const defaultRelativePeriodType = getRelativePeriodsOptionsById(MONTHS)
const defaultFixedPeriodType = getFixedPeriodsOptionsById(MONTHLY)
const defaultFixedPeriodYear = new Date().getFullYear()
const fixedPeriodConfig = year => ({
    offset: year - defaultFixedPeriodYear,
    filterFuturePeriods: false,
    reversePeriods: false,
})

class PeriodSelector extends Component {
    state = {
        allPeriods: defaultRelativePeriodType.getPeriods(),
        selectedPeriods: [],
        isRelative: true,
        relativeFilter: {
            periodType: defaultRelativePeriodType.id,
        },
        fixedFilter: {
            periodType: defaultFixedPeriodType.id,
            year: defaultFixedPeriodYear.toString(),
        },
    }

    constructor(props) {
        super(props)

        this.state.selectedPeriods = this.props.initialSelectedPeriods
    }

    onIsRelativeClick = isRelative => {
        if (this.state.isRelative !== isRelative) {
            this.setState({ isRelative })
            this.setState({
                allPeriods: isRelative
                    ? getRelativePeriodsOptionsById(
                          this.state.relativeFilter.periodType
                      ).getPeriods()
                    : getFixedPeriodsOptionsById(
                          this.state.fixedFilter.periodType
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
                                    filter
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
                fixedFilter.periodType
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
                const formattedItems = selected.map(id => ({
                    id,
                    name: [
                        ...this.state.allPeriods,
                        ...this.state.selectedPeriods,
                    ].find(item => item.id === id).name,
                }))
                this.setState({ selectedPeriods: formattedItems })
                this.props.onSelect(formattedItems)
            }}
            selected={this.state.selectedPeriods.map(period => period.id)}
            leftHeader={this.renderHeader()}
            enableOrderChange
            height={TRANSFER_HEIGHT}
            optionsWidth={TRANSFER_OPTIONS_WIDTH}
            selectedWidth={TRANSFER_SELECTED_WIDTH}
            selectedEmptyComponent={this.renderEmptySelection()}
            rightFooter={this.props.rightFooter}
            options={this.state.allPeriods.map(({ id, name }) => ({
                label: name,
                value: id,
            }))}
            renderOption={props => (
                <TransferOption {...props} icon={PeriodIcon} />
            )}
            // TODO: Add rightHeader "Selected Periods" once the Transfer component supports this (https://github.com/dhis2/ui-core/issues/885)
        ></Transfer>
    )
}

PeriodSelector.propTypes = {
    onSelect: PropTypes.func.isRequired,
    initialSelectedPeriods: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ),
    rightFooter: PropTypes.node,
}

PeriodSelector.defaultProps = {
    initialSelectedPeriods: [],
}

export default PeriodSelector
