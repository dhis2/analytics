import React, { Component } from 'react'
import PropTypes from 'prop-types'

import InputLabel from './InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import FormControl from '@material-ui/core/FormControl'
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import ArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'

import i18n from '@dhis2/d2-i18n'
import PeriodTypeFilter from './PeriodTypeFilter'
import FixedPeriodsGenerator from './modules/FixedPeriodsGenerator'

export const defaultState = {
    periodType: 'Monthly',
    year: new Date().getFullYear(),
    yearsOffset: 0,
    yearSelectElement: null,
}

export const YEARS_RANGE = 8

class FixedPeriodFilter extends Component {
    constructor(props) {
        super(props)

        this.periodsGenerator = new FixedPeriodsGenerator()
        this.state = defaultState
    }

    componentDidMount = () => {
        const periods = this.generatePeriods(
            this.state.periodType,
            this.state.year
        )

        this.props.setOfferedPeriods(periods, true)
    }

    onPeriodTypeChange = event => {
        this.setState({
            periodType: event.target.value,
        })

        if (this.state.year) {
            this.props.setOfferedPeriods(
                this.generatePeriods(event.target.value, this.state.year)
            )
        }
    }

    onYearChange = event => {
        this.setState({
            year: event.target.value,
            yearSelectElement: null,
        })

        if (this.state.periodType) {
            this.props.setOfferedPeriods(
                this.generatePeriods(this.state.periodType, event.target.value)
            )
        }
    }

    onYearSelectClick = event => {
        this.setState({ yearSelectElement: event.currentTarget })
    }

    getYears = () => {
        let years = []

        years = years.concat(
            [
                ...Array(
                    Math.floor(YEARS_RANGE / 2) +
                        (YEARS_RANGE % 2 === 0 ? 1 : 2)
                ).keys(),
            ]
                .slice(1)
                .reverse()
                .map(
                    offset =>
                        new Date().getFullYear() -
                        offset +
                        this.state.yearsOffset
                )
        )

        years = years.concat(
            [...Array(Math.floor(YEARS_RANGE / 2)).keys()].map(
                offset =>
                    new Date().getFullYear() + offset + this.state.yearsOffset
            )
        )

        return years
    }

    generatePeriods = (periodType, year) => {
        const generator = this.periodsGenerator.get(periodType)

        return generator
            .generatePeriods({
                offset: year - new Date().getFullYear(),
                filterFuturePeriods: false,
                reversePeriods: false,
            })
            .map((period, idx) => ({ ...period, idx }))
    }

    closeYearSelect = () => {
        this.setState({ yearSelectElement: null })
    }

    shiftYearsBack = () => {
        this.setState({ yearsOffset: this.state.yearsOffset - YEARS_RANGE })
    }

    shiftYearsForth = () => {
        this.setState({ yearsOffset: this.state.yearsOffset + YEARS_RANGE })
    }

    renderYearSelectValue = () => this.state.year

    render() {
        const years = this.getYears()

        return (
            <>
                <PeriodTypeFilter
                    options={this.periodsGenerator.getOptions()}
                    value={this.state.periodType}
                    onChange={this.onPeriodTypeChange}
                />
                <FormControl>
                    <InputLabel label={i18n.t('Year')} />
                    <Select
                        SelectDisplayProps={{
                            style: { cursor: 'pointer', color: '#000000' },
                            onClick: this.onYearSelectClick,
                        }}
                        value={this.state.year}
                        inputProps={{ name: 'year', id: 'year' }}
                        renderValue={this.renderYearSelectValue}
                        disableUnderline
                        disabled
                    />
                    <Menu
                        MenuListProps={{
                            style: { width: '130px' },
                        }}
                        anchorEl={this.state.yearSelectElement}
                        open={Boolean(this.state.yearSelectElement)}
                        onClose={this.closeYearSelect}
                    >
                        <MenuItem
                            value=""
                            key="shiftYearsBack"
                            onClick={this.shiftYearsBack}
                        >
                            <ArrowUpIcon />
                        </MenuItem>
                        {years.map(year => (
                            <MenuItem
                                onClick={this.onYearChange}
                                key={year}
                                value={year}
                                selected={this.state.year === year}
                            >
                                {year}
                            </MenuItem>
                        ))}
                        <MenuItem
                            value=""
                            key="shiftYearsForth"
                            onClick={this.shiftYearsForth}
                        >
                            <ArrowDownIcon />
                        </MenuItem>
                    </Menu>
                </FormControl>
            </>
        )
    }
}

FixedPeriodFilter.propTypes = {
    setOfferedPeriods: PropTypes.func.isRequired,
}

export default FixedPeriodFilter
