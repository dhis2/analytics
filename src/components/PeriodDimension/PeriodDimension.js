import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { PeriodSelector } from '@dhis2/d2-ui-period-selector-dialog'
import i18n from '@dhis2/d2-i18n'

import { FIXED_DIMENSIONS } from '../../modules/fixedDimensions'

const peId = FIXED_DIMENSIONS.pe.id

const PERIOD = 'PERIOD'

export class PeriodDimension extends Component {
    selectItems = periods => {
        const itemsToAdd = periods.reduce((array, item) => {
            array.push({ ...item, dimensionItemType: PERIOD })
            return array
        }, [])

        this.props.onSelect({
            dimensionId: peId,
            items: [...this.props.selectedPeriods, ...itemsToAdd],
        })
    }

    deselectItems = periods => {
        const itemIdsToRemove = periods.map(period => period.id)

        this.props.onDeselect({
            dimensionId: peId,
            itemIdsToRemove,
        })
    }

    reorderItems = periods => {
        const itemIds = periods.map(period => period.id)

        this.props.onReorder({
            dimensionId: peId,
            itemIds,
        })
    }

    render = () => {
        const { selectedPeriods } = this.props
        console.log('PeriodDimension render with', selectedPeriods)

        return (
            <Fragment>
                <DialogTitle>{i18n.t('Period')}</DialogTitle>
                <DialogContent>
                    <PeriodSelector
                        onSelect={this.selectItems}
                        onDeselect={this.deselectItems}
                        onReorder={this.reorderItems}
                        selectedItems={selectedPeriods}
                    />
                </DialogContent>
            </Fragment>
        )
    }
}

PeriodDimension.propTypes = {
    d2: PropTypes.object,
    selectedPeriods: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
}

PeriodDimension.defaultProps = {
    selectedPeriods: [],
}

export default PeriodDimension
