import React, { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import ItemSelector from '../ItemSelector/ItemSelector'
import PeriodTypeButton from './PeriodTypeButton'
import FixedPeriodFilter from './FixedPeriodFilter'
import RelativePeriodFilter from './RelativePeriodFilter'
import { FIXED, RELATIVE } from './modules/periodTypes'
import styles from './styles/PeriodSelector.style'

class PeriodSelector extends Component {
    state = {
        offeredPeriods: [],
        offeredPeriodsInOrder: [],
        selectedPeriods: [],
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
        const offeredPeriods = this.state.offeredPeriodsInOrder.filter(
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

        this.setState({ offeredPeriodsInOrder: periods, offeredPeriods })
    }

    render = () => {
        const FilterOptions =
            this.state.periodType === FIXED
                ? FixedPeriodFilter
                : RelativePeriodFilter

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

        return (
            <>
                <div>
                    <PeriodTypeButton
                        active={this.state.periodType === RELATIVE}
                        text={i18n.t('Relative periods')}
                        onClick={() => this.onPeriodTypeClick(RELATIVE)}
                    />
                    <PeriodTypeButton
                        active={this.state.periodType === FIXED}
                        text={i18n.t('Fixed periods')}
                        onClick={() => this.onPeriodTypeClick(FIXED)}
                    />
                </div>
                <div className="period-selector">
                    <ItemSelector unselected={unselected} selected={selected}>
                        <div className="options-area">
                            <FilterOptions
                                setOfferedPeriods={
                                    this.initializeOfferedPeriods
                                }
                            />
                        </div>
                    </ItemSelector>
                </div>
                <style jsx>{styles}</style>
            </>
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
