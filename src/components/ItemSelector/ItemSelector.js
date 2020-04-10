import React, { Component } from 'react'
import PropTypes from 'prop-types'

import UnselectedItems from './UnselectedItems'
import SelectedItems from './SelectedItems'
import styles from './styles/ItemSelector.module.css'

class ItemSelector extends Component {
    render() {
        const { unselected, selected, children: filterZone } = this.props

        return (
            <div styles={styles.itemSelectorContainer}>
                <div styles={styles.section}>
                    {/* TODO: Add styles.unselected*/}
                    {filterZone}
                    <UnselectedItems {...unselected} />
                </div>
                <div styles={styles.section}>
                    {/* TODO: Add styles.selected*/}
                    <SelectedItems {...selected} />
                </div>
            </div>
        )
    }
}

ItemSelector.propTypes = {
    children: PropTypes.object,
    selected: PropTypes.shape({
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                isActive: PropTypes.bool,
            })
        ).isRequired,
        onDeselect: PropTypes.func.isRequired,
        onReorder: PropTypes.func.isRequired,
        dialogId: PropTypes.string,
        infoBoxMessage: PropTypes.string,
    }),
    unselected: PropTypes.shape({
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            })
        ).isRequired,
        onSelect: PropTypes.func.isRequired,
        filterText: PropTypes.string,
        requestMoreItems: PropTypes.func,
    }),
}

export default ItemSelector
