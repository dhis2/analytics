import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Transfer, TransferOption, TabBar, Tab } from '@dhis2/ui-core'
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

const defaultRelativePeriod = getRelativePeriodsOptionsById(MONTHS)
const defaultFixedPeriodType = getFixedPeriodsOptionsById(MONTHLY)
const defaultFixedPeriodYear = new Date().getFullYear().toString()
const fixedPeriodConfig = year => ({
    offset: year - new Date().getFullYear(),
    filterFuturePeriods: false,
    reversePeriods: false,
})

class PeriodSelector extends Component {
    state = {
        allPeriods: defaultRelativePeriod.periods,
        selectedPeriods: [],
        isRelative: true,
        relativeFilter: {
            //TODO: refactor to use the whole object instead of just label/value
            label: defaultRelativePeriod.getName(),
            value: defaultRelativePeriod.id,
        },
        fixedFilter: {
            type: {
                label: defaultFixedPeriodType.getName(),
                value: defaultFixedPeriodType.id,
            },
            year: {
                label: defaultFixedPeriodYear,
                value: defaultFixedPeriodYear,
            },
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
                          this.state.relativeFilter.value
                      ).periods
                    : getFixedPeriodsOptionsById(
                          this.state.fixedFilter.type.label
                      ).generator.generatePeriods(
                          fixedPeriodConfig(
                              Number(this.state.fixedFilter.year.value)
                          )
                      ),
            })
        }
    }

    // onSelectPeriods = periodIds => {
    //     const offeredPeriods = this.state.offeredPeriods.filter(
    //         period => !periodIds.includes(period.id)
    //     )
    //     const newPeriods = this.state.offeredPeriods.filter(period =>
    //         periodIds.includes(period.id)
    //     )
    //     const selectedPeriods = this.state.selectedPeriods.concat(newPeriods)

    //     this.setState({ selectedPeriods, offeredPeriods })
    //     this.props.onSelect(selectedPeriods)
    // }

    // setSelectedPeriodOrder = periodIds => {
    //     const selectedPeriods = periodIds.map(id =>
    //         this.state.selectedPeriods.find(period => period.id === id)
    //     )

    //     this.setState({ selectedPeriods })
    //     this.props.onReorder(selectedPeriods)
    // }

    // onDeselectPeriods = periodIds => {
    //     const selectedPeriods = this.state.selectedPeriods.filter(
    //         period => !periodIds.includes(period.id)
    //     )
    //     const removedPeriods = this.state.selectedPeriods.filter(period =>
    //         periodIds.includes(period.id)
    //     )
    //     const offeredPeriods = this.state.allPeriods.filter(
    //         period => !selectedPeriods.map(p => p.id).includes(period.id)
    //     )

    //     this.setState({ selectedPeriods, offeredPeriods })
    //     this.props.onDeselect(removedPeriods)
    // }

    // initializeOfferedPeriods = (periods, initial = false) => {
    //     const selectedPeriods = initial
    //         ? this.props.selectedItems
    //         : this.state.selectedPeriods
    //     const offeredPeriods = periods.filter(
    //         period => !selectedPeriods.map(p => p.id).includes(period.id)
    //     )

    //     this.setState({ allPeriods: periods, offeredPeriods })
    // }

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

            <p style={{ margin: 0, height: 10 }} />
            <div>
                {this.state.isRelative ? (
                    <RelativePeriodFilter
                        currentFilter={this.state.relativeFilter}
                        selectFilter={relativeFilter => {
                            this.setState({ relativeFilter })
                            this.setState({
                                allPeriods: getRelativePeriodsOptionsById(
                                    relativeFilter.value
                                ).periods,
                            })
                        }}
                    />
                ) : (
                    <FixedPeriodFilter
                        currentFilter={this.state.fixedFilter}
                        selectFilter={fixedFilter => {
                            this.setState({ fixedFilter })
                            this.setState({
                                allPeriods: getFixedPeriodsOptionsById(
                                    fixedFilter.type.value
                                ).generator.generatePeriods(
                                    fixedPeriodConfig(
                                        Number(fixedFilter.year.value)
                                    )
                                ),
                            })
                        }}
                    />
                )}
            </div>
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
            // TODO: Add rightFooter to be passed in as a prop
        >
            {this.state.allPeriods.map(item => (
                <TransferOption
                    label={item.getName()}
                    value={item.id}
                    key={item.id}
                />
            ))}
        </Transfer>
    )
}

PeriodSelector.propTypes = {
    onSelect: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
}

PeriodSelector.defaultProps = {
    selectedItems: [],
}

export default PeriodSelector
