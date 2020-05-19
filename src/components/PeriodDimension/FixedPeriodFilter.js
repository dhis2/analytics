import React, { useState } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import { getFixedPeriodsOptions } from './utils/FixedPeriodsGenerator'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui-core'

// export const defaultState = {
//     periodType: MONTHLY,
//     year: new Date().getFullYear(),
//     yearsOffset: 0,
//     yearSelectElement: null,
// }

const YEARS_RANGE = 8

const getYears = yearsOffset => {
    let years = []

    years = years.concat(
        [
            ...Array(
                Math.floor(YEARS_RANGE / 2) + (YEARS_RANGE % 2 === 0 ? 1 : 2)
            ).keys(),
        ]
            .slice(1)
            .reverse()
            .map(offset => new Date().getFullYear() - offset + yearsOffset)
    )

    years = years.concat(
        [...Array(Math.floor(YEARS_RANGE / 2)).keys()].map(
            offset => new Date().getFullYear() + offset + yearsOffset
        )
    )

    return years.map(year => year.toString())
}

const shiftYearsBack = () => {
    // this.setState({ yearsOffset: this.state.yearsOffset - YEARS_RANGE })
}

const shiftYearsForth = () => {
    // this.setState({ yearsOffset: this.state.yearsOffset + YEARS_RANGE })
}

const FixedPeriodFilter = ({ currentFilter, selectFilter }) => {
    // TODO:
    // Add state for yearsOffset
    // Generate years with the arrows up and down

    const [yearsOffset, setYearsOffset] = useState(0)

    return (
        <>
            <SingleSelectField
                label={i18n.t('Period type')}
                onChange={({ selected }) =>
                    selectFilter({ year: currentFilter.year, type: selected })
                }
                dense
                selected={currentFilter.type}
            >
                {getFixedPeriodsOptions().map(option => (
                    <SingleSelectOption
                        key={option.id}
                        value={option.id}
                        label={option.getName()}
                    />
                ))}
            </SingleSelectField>
            <SingleSelectField
                label={i18n.t('Year')}
                onChange={({ selected }) =>
                    selectFilter({ year: selected, type: currentFilter.type })
                }
                dense
                selected={currentFilter.year}
            >
                {
                    // TODO: Add a way to select older years (yearsOffset)
                }
                {getYears(yearsOffset).map(year => (
                    <SingleSelectOption key={year} value={year} label={year} />
                ))}
            </SingleSelectField>
        </>
    )
}

const legacy = {
    // class FixedPeriodFilter extends Component {
    //     constructor(props) {
    //         super(props)
    //         this.periodsGenerator = new FixedPeriodsGenerator()
    //         this.state = defaultState
    //     }
    //     componentDidMount = () => {
    //         const periods = this.generatePeriods(
    //             this.state.periodType,
    //             this.state.year
    //         )
    //         this.props.setOfferedPeriods(periods, true)
    //     }
    //     onPeriodTypeChange = event => {
    //         this.setState({
    //             periodType: event.target.value,
    //         })
    //         if (this.state.year) {
    //             this.props.setOfferedPeriods(
    //                 this.generatePeriods(event.target.value, this.state.year)
    //             )
    //         }
    //     }
    //     onYearChange = event => {
    //         this.setState({
    //             year: event.target.value,
    //             yearSelectElement: null,
    //         })
    //         if (this.state.periodType) {
    //             this.props.setOfferedPeriods(
    //                 this.generatePeriods(this.state.periodType, event.target.value)
    //             )
    //         }
    //     }
    //     onYearSelectClick = event => {
    //         this.setState({ yearSelectElement: event.currentTarget })
    //     }
    //     getYears = () => {
    //         let years = []
    //         years = years.concat(
    //             [
    //                 ...Array(
    //                     Math.floor(YEARS_RANGE / 2) +
    //                         (YEARS_RANGE % 2 === 0 ? 1 : 2)
    //                 ).keys(),
    //             ]
    //                 .slice(1)
    //                 .reverse()
    //                 .map(
    //                     offset =>
    //                         new Date().getFullYear() -
    //                         offset +
    //                         this.state.yearsOffset
    //                 )
    //         )
    //         years = years.concat(
    //             [...Array(Math.floor(YEARS_RANGE / 2)).keys()].map(
    //                 offset =>
    //                     new Date().getFullYear() + offset + this.state.yearsOffset
    //             )
    //         )
    //         return years
    //     }
    //     generatePeriods = (periodType, year) => {
    //         const generator = this.periodsGenerator.get(periodType)
    //         return generator
    //             .generatePeriods({
    //                 offset: year - new Date().getFullYear(),
    //                 filterFuturePeriods: false,
    //                 reversePeriods: false,
    //             })
    //             .map((period, idx) => ({ ...period, idx }))
    //     }
    //     closeYearSelect = () => {
    //         this.setState({ yearSelectElement: null })
    //     }
    //     shiftYearsBack = () => {
    //         this.setState({ yearsOffset: this.state.yearsOffset - YEARS_RANGE })
    //     }
    //     shiftYearsForth = () => {
    //         this.setState({ yearsOffset: this.state.yearsOffset + YEARS_RANGE })
    //     }
    //     renderYearSelectValue = () => this.state.year
    //     render() {
    //         const years = this.getYears()
    //         return (
    //             <>
    //                 <PeriodTypeFilter
    //                     options={this.periodsGenerator.getOptions()}
    //                     value={this.state.periodType}
    //                     onChange={this.onPeriodTypeChange}
    //                 />
    //                 <FormControl>
    //                     <Select
    //                         SelectDisplayProps={{
    //                             style: { cursor: 'pointer', color: '#000000' },
    //                             onClick: this.onYearSelectClick,
    //                         }}
    //                         value={this.state.year}
    //                         inputProps={{ name: 'year', id: 'year' }}
    //                         renderValue={this.renderYearSelectValue}
    //                         disableUnderline
    //                         disabled
    //                     />
    //                     <Menu
    //                         MenuListProps={{
    //                             style: { width: '130px' },
    //                         }}
    //                         anchorEl={this.state.yearSelectElement}
    //                         open={Boolean(this.state.yearSelectElement)}
    //                         onClose={this.closeYearSelect}
    //                     >
    //                         <MenuItem
    //                             value=""
    //                             key="shiftYearsBack"
    //                             onClick={this.shiftYearsBack}
    //                         >
    //                             <ArrowUpIcon />
    //                         </MenuItem>
    //                         {years.map(year => (
    //                             <MenuItem
    //                                 onClick={this.onYearChange}
    //                                 key={year}
    //                                 value={year}
    //                                 selected={this.state.year === year}
    //                             >
    //                                 {year}
    //                             </MenuItem>
    //                         ))}
    //                         <MenuItem
    //                             value=""
    //                             key="shiftYearsForth"
    //                             onClick={this.shiftYearsForth}
    //                         >
    //                             <ArrowDownIcon />
    //                         </MenuItem>
    //                     </Menu>
    //                 </FormControl>
    //             </>
    //         )
    //     }
    // }
}

FixedPeriodFilter.propTypes = {
    currentFilter: PropTypes.object.isRequired,
    selectFilter: PropTypes.func.isRequired,
}

export default FixedPeriodFilter
