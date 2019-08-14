import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { PeriodSelector } from '@dhis2/d2-ui-period-selector-dialog'
import i18n from '@dhis2/d2-i18n'

import { DIMENSION_ID_PERIOD } from '../../modules/fixedDimensions'

export class PeriodDimension extends Component {
    selectItems = periods => {
        const newItems = periods.map(p => ({
            id: p.id,
            name: p.name,
        }))
        const alreadySelected = this.props.selectedPeriods.map(p => ({
            id: p.id,
            name: p.name,
        }))

        this.props.onSelect({
            dimensionId: DIMENSION_ID_PERIOD,
            items: uniqBy(alreadySelected.concat(newItems), 'id'),
        })
    }

    deselectItems = periods => {
        const itemIdsToRemove = periods.map(period => period.id)

        this.props.onDeselect({
            dimensionId: DIMENSION_ID_PERIOD,
            itemIdsToRemove,
        })
    }

    reorderItems = periods => {
        const itemIds = periods.map(period => period.id)

        this.props.onReorder({
            dimensionId: DIMENSION_ID_PERIOD,
            itemIds,
        })
    }

    render = () => {
        const { selectedPeriods } = this.props

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
