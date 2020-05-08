import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PeriodTypeFilter from './PeriodTypeFilter'
import RelativePeriodsGenerator, {
    MONTHS,
} from './modules/RelativePeriodsGenerator'

export const defaultState = {
    periodType: MONTHS,
}

class RelativePeriods extends Component {
    constructor(props) {
        super(props)

        this.state = defaultState
        this.periodsGenerator = new RelativePeriodsGenerator()
    }

    componentDidMount = () => {
        const periods = this.generatePeriods(this.state.periodType)
        this.props.setOfferedPeriods(periods, true)
    }

    onPeriodTypeChange = event => {
        this.setState({
            periodType: event.target.value,
        })

        this.props.setOfferedPeriods(this.generatePeriods(event.target.value))
    }

    generatePeriods = periodType => {
        const generator = this.periodsGenerator.get(periodType)

        return generator
            .generatePeriods()
            .map((period, idx) => ({ ...period, idx }))
    }

    render = () => {
        return (
            <PeriodTypeFilter
                options={this.periodsGenerator.getOptions()}
                value={this.state.periodType}
                onChange={this.onPeriodTypeChange}
            />
        )
    }
}

RelativePeriods.propTypes = {
    setOfferedPeriods: PropTypes.func.isRequired,
}

export default RelativePeriods
