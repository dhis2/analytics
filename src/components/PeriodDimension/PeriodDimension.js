import React, { useState } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import {
    TabBar,
    Tab,
    SingleSelectField,
    SingleSelectOption,
    Transfer,
} from '@dhis2/ui-core'
import i18n from '@dhis2/d2-i18n'

import { DIMENSION_ID_PERIOD } from '../../modules/predefinedDimensions'
import RelativePeriodFilter from './RelativePeriodFilter'

const Header = ({ onClick, isRelative, selected, onSelectedYearChange }) => (
    <>
        <TabBar>
            <Tab
                selected={isRelative}
                onClick={() => onClick({ isRelative: true })}
            >
                {i18n.t('Relative periods')}
            </Tab>

            <Tab
                selected={!isRelative}
                onClick={() => onClick({ isRelative: false })}
            >
                {i18n.t('Fixed periods')}
            </Tab>
        </TabBar>

        <p style={{ margin: 0, height: 10 }} />
        {isRelative ? (
            <RelativePeriodFilter setOfferedPeriods={() => {}} />
        ) : (
            <SingleSelectField
                label="Year"
                selected={selected}
                onChange={onSelectedYearChange}
            >
                <SingleSelectOption value="2020" label="2020" />
                <SingleSelectOption value="2019" label="2019" />
            </SingleSelectField>
        )}
    </>
)

Header.propTypes = {
    isRelative: PropTypes.bool.isRequired,
    selected: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onSelectedYearChange: PropTypes.func.isRequired,
}

export const PeriodDimension = ({
    onDeselect,
    onReorder,
    onSelect,
    selectedPeriods,
}) => {
    const selectItems = periods => {
        const newItems = periods.map(period => ({
            id: period.id,
            name: period.name,
        }))
        const alreadySelected = selectedPeriods.map(period => ({
            id: period.id,
            name: period.name,
        }))

        onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: uniqBy(alreadySelected.concat(newItems), 'id'),
        })
    }

    const deselectItems = periods => {
        const itemIdsToRemove = periods.map(period => period.id)

        onDeselect({
            dimensionId: DIMENSION_ID_PERIOD,
            itemIdsToRemove,
        })
    }

    const reorderItems = periods => {
        const itemIds = periods.map(period => period.id)

        onReorder({
            dimensionId: DIMENSION_ID_PERIOD,
            itemIds,
        })
    }

    const renderTransfer = props => {
        const [filter, setFilter] = useState('')
        const [isRelative, setIsRelative] = useState(true)
        const [year, setYear] = useState({ label: '2020', value: '2020' })
        const filterCallback = (options, filter) => {
            const optionsWithYear = options.filter(
                option => option.year === year.value
            )

            const optionsWithPeriod = optionsWithYear.filter(
                option => option.isRelative === isRelative
            )

            if (filter === '') return optionsWithPeriod

            return optionsWithPeriod.filter(
                ({ label }) => label.indexOf(filter) !== -1
            )
        }

        const header = (
            <Header
                isRelative={isRelative}
                selectedYear={year}
                onSelectedYearChange={({ selected }) => setYear(selected)}
                onClick={({ isRelative: newState }) => setIsRelative(newState)}
            />
        )
        console.log('Test 2')

        return (
            <Transfer
                {...props}
                filterable
                hideFilterInput={true}
                searchTerm={filter}
                filterCallback={filterCallback}
                leftHeader={header}
                onFilterChange={({ value }) => setFilter(value)}
                height="400px"
                filterLabel="Filter options"
            />
        )
    }

    return (
        <div>{renderTransfer()}</div>
        // <PeriodSelector
        //     onSelect={selectItems}
        //     onDeselect={deselectItems}
        //     onReorder={reorderItems}
        //     selectedItems={selectedPeriods}
        // />
    )
}

PeriodDimension.propTypes = {
    onDeselect: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedPeriods: PropTypes.array,
}

PeriodDimension.defaultProps = {
    selectedPeriods: [],
}

export default PeriodDimension
