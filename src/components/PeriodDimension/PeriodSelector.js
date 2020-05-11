import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Transfer, TransferOption } from '@dhis2/ui-core'

import ItemSelector from './../ItemSelector/ItemSelector'
import PeriodTypeButton from './PeriodTypeButton'
import FixedPeriodFilter from './FixedPeriodFilter'
import RelativePeriodFilter from './RelativePeriodFilter'
import { FIXED, RELATIVE } from './utils/periodTypes'

class PeriodSelector extends Component {
    state = {
        allPeriods: [],
        selectedPeriods: [],
        offeredPeriods: [], // TODO: Legacy, Transfer handles this internally
        periodType: RELATIVE,
    }

    constructor(props) {
        super(props)

        this.state.selectedPeriods = this.props.selectedItems
    }

    onPeriodTypeClick = periodType => {
        if (this.state.periodType !== periodType) {
            this.setState({ periodType })
        }
    }

    onSelectPeriods = periodIds => {
        const offeredPeriods = this.state.offeredPeriods.filter(
            period => !periodIds.includes(period.id)
        )
        const newPeriods = this.state.offeredPeriods.filter(period =>
            periodIds.includes(period.id)
        )
        const selectedPeriods = this.state.selectedPeriods.concat(newPeriods)

        this.setState({ selectedPeriods, offeredPeriods })
        this.props.onSelect(selectedPeriods)
    }

    setSelectedPeriodOrder = periodIds => {
        const selectedPeriods = periodIds.map(id =>
            this.state.selectedPeriods.find(period => period.id === id)
        )

        this.setState({ selectedPeriods })
        this.props.onReorder(selectedPeriods)
    }

    onDeselectPeriods = periodIds => {
        const selectedPeriods = this.state.selectedPeriods.filter(
            period => !periodIds.includes(period.id)
        )
        const removedPeriods = this.state.selectedPeriods.filter(period =>
            periodIds.includes(period.id)
        )
        const offeredPeriods = this.state.allPeriods.filter(
            period => !selectedPeriods.map(p => p.id).includes(period.id)
        )

        this.setState({ selectedPeriods, offeredPeriods })
        this.props.onDeselect(removedPeriods)
    }

    initializeOfferedPeriods = (periods, initial = false) => {
        const selectedPeriods = initial
            ? this.props.selectedItems
            : this.state.selectedPeriods
        const offeredPeriods = periods.filter(
            period => !selectedPeriods.map(p => p.id).includes(period.id)
        )

        this.setState({ allPeriods: periods, offeredPeriods })
    }

    renderPeriodTypeButtons = () => (
        <div>
            <PeriodTypeButton
                periodType={RELATIVE}
                activePeriodType={this.state.periodType}
                text={'Relative periods'}
                onClick={this.onPeriodTypeClick}
            />
            <PeriodTypeButton
                periodType={FIXED}
                activePeriodType={this.state.periodType}
                text={'Fixed periods'}
                onClick={this.onPeriodTypeClick}
            />
        </div>
    )

    render = () => {
        const filterZone = () => {
            if (this.state.periodType === FIXED) {
                return (
                    <FixedPeriodFilter
                        setOfferedPeriods={this.initializeOfferedPeriods}
                    />
                )
            }

            return (
                <RelativePeriodFilter
                    setOfferedPeriods={this.initializeOfferedPeriods}
                />
            )
        }

        const unselected = {
            items: this.state.offeredPeriods,
            onSelect: this.onSelectPeriods,
            filterText: '',
        }

        const selected = {
            items: this.state.selectedPeriods,
            onDeselect: this.onDeselectPeriods,
            onReorder: this.setSelectedPeriodOrder,
        }

        const testoptions = this.state.allPeriods.map(item => (
            <TransferOption label={item.name} value={item.name} key={item.id} />
        ))

        return (
            <Fragment>
                {this.renderPeriodTypeButtons()}
                <div style={{ display: 'flex', marginTop: '18px' }}>
                    <ItemSelector
                        itemClassName="period-selector"
                        unselected={unselected}
                        selected={selected}
                    >
                        {filterZone()}
                    </ItemSelector>
                </div>
                <Transfer
                    onChange={() => console.log('things changed')}
                    selected={this.state.selectedPeriods.map(item => ({
                        label: item.name,
                        value: item.name,
                        key: item.id,
                    }))}
                >
                    {testoptions}
                </Transfer>
            </Fragment>
        )
    }
}

PeriodSelector.propTypes = {
    onDeselect: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
}

PeriodSelector.defaultProps = {
    selectedItems: [],
}

export default PeriodSelector
