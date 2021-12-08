import PropTypes from 'prop-types'
import React, { Component } from 'react'
import i18n from '../../../locales/index.js'
import {
    getPredefinedDimensions,
    getFixedDimensions,
} from '../../../modules/predefinedDimensions'
import DimensionItem from './DimensionItem'
import styles from './styles/DimensionList.style'

class DimensionList extends Component {
    nameContainsFilterText = (dimension) =>
        dimension.name
            .toLowerCase()
            .includes(this.props.filterText.toLowerCase())

    isDisabled = (dimensionId) =>
        this.props.disabledDimension(dimensionId) || false

    isRecommended = (dimensionId) =>
        this.props.recommendedDimension(dimensionId) || false

    isLocked = (dimensionId) => this.props.lockedDimension(dimensionId) || false

    renderItem = (dimension) => (
        <DimensionItem
            id={dimension.id}
            key={dimension.id}
            name={dimension.name}
            isLocked={this.isLocked(dimension.id)}
            isSelected={this.props.selectedIds.includes(dimension.id)}
            isRecommended={this.isRecommended(dimension.id)}
            isDeactivated={this.isDisabled(dimension.id)}
            onClick={this.props.onDimensionClick}
            onOptionsClick={this.props.onDimensionOptionsClick}
            onDragStart={this.props.onDimensionDragStart}
        />
    )

    getDimensionItemsByFilter = (filter) =>
        this.props.dimensions
            .filter(filter)
            .filter(this.nameContainsFilterText)
            .map(this.renderItem)

    render() {
        const fixedDimensions = this.getDimensionItemsByFilter((dimension) =>
            Object.values(getFixedDimensions()).some(
                (fixedDim) => fixedDim.id === dimension.id
            )
        )
        const nonPredefinedDimensions = this.getDimensionItemsByFilter(
            (dimension) =>
                !Object.values(getPredefinedDimensions()).some(
                    (predefDim) => predefDim.id === dimension.id
                )
        )

        return (
            <div className="container">
                <div className="wrapper">
                    {fixedDimensions?.length ? (
                        <div className="section">
                            <h3 className="header">
                                {i18n.t('Main dimensions')}
                            </h3>
                            <ul className="list">{fixedDimensions}</ul>
                        </div>
                    ) : null}
                    {nonPredefinedDimensions?.length ? (
                        <div className="section">
                            <h3 className="header">
                                {i18n.t('Your dimensions')}
                            </h3>
                            <ul className="list">{nonPredefinedDimensions}</ul>
                        </div>
                    ) : null}
                </div>
                <style jsx>{styles}</style>
            </div>
        )
    }
}

DimensionList.propTypes = {
    dimensions: PropTypes.array.isRequired,
    filterText: PropTypes.string.isRequired,
    disabledDimension: PropTypes.func,
    lockedDimension: PropTypes.func,
    recommendedDimension: PropTypes.func,
    selectedIds: PropTypes.array,
    onDimensionClick: PropTypes.func,
    onDimensionDragStart: PropTypes.func,
    onDimensionOptionsClick: PropTypes.func,
}

DimensionList.defaultProps = {
    selectedIds: [],
    disabledDimension: Function.prototype,
    lockedDimension: Function.prototype,
    recommendedDimension: Function.prototype,
}

export default DimensionList
