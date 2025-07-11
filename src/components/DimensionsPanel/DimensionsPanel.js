import PropTypes from 'prop-types'
import React, { Component } from 'react'
import i18n from '../../locales/index.js'
import Filter from '../Filter/Filter.js'
import DimensionList from './List/DimensionList.js'
import { styles } from './styles/DimensionsPanel.style.js'

class DimensionsPanel extends Component {
    static defaultProps = {
        selectedIds: [],
        style: {},
        onDimensionClick: Function.prototype,
    }

    state = { filterText: '' }

    onClearFilter = () => {
        this.setState({ filterText: '' })
    }

    onFilterTextChange = (filterText) => {
        this.setState({ filterText })
    }

    render() {
        const {
            dimensions,
            selectedIds,
            disabledDimension,
            lockedDimension,
            recommendedDimension,
            onDimensionClick,
            onDimensionOptionsClick,
            onDimensionDragStart,
            style,
        } = this.props

        return (
            <div style={{ ...styles.divContainer, ...style }}>
                <Filter
                    placeholder={i18n.t('Filter dimensions')}
                    text={this.state.filterText}
                    onChange={this.onFilterTextChange}
                    onClear={this.onClearFilter}
                    type="search"
                />
                <DimensionList
                    dimensions={dimensions}
                    selectedIds={selectedIds}
                    filterText={this.state.filterText}
                    disabledDimension={disabledDimension}
                    lockedDimension={lockedDimension}
                    recommendedDimension={recommendedDimension}
                    onDimensionOptionsClick={onDimensionOptionsClick}
                    onDimensionClick={onDimensionClick}
                    onDimensionDragStart={onDimensionDragStart}
                />
            </div>
        )
    }
}

DimensionsPanel.propTypes = {
    dimensions: PropTypes.array.isRequired,
    disabledDimension: PropTypes.func,
    lockedDimension: PropTypes.func,
    recommendedDimension: PropTypes.func,
    selectedIds: PropTypes.array,
    style: PropTypes.object,
    onDimensionClick: PropTypes.func,
    onDimensionDragStart: PropTypes.func,
    onDimensionOptionsClick: PropTypes.func,
}

export default DimensionsPanel
