import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import UnselectedItems from './UnselectedItems'
import SelectedItems from './SelectedItems'
import styles from './styles/ItemSelector.style'

// TODO: Unused in Analytics apps, remove or deprecate?
class ItemSelector extends Component {
    render() {
        const {
            unselected,
            selected,
            children: filterZone,
            dataTest,
        } = this.props

        return (
            <div className="item-selector-container" data-test={dataTest}>
                <div className={cx('section', 'unselected')}>
                    {filterZone}
                    <UnselectedItems
                        {...unselected}
                        dataTest={`${dataTest}-unselected-items`}
                    />
                </div>
                <div className={cx('section', 'selected')}>
                    <SelectedItems
                        {...selected}
                        dataTest={`${dataTest}-selected-items`}
                    />
                </div>
                <style jsx>{styles}</style>
            </div>
        )
    }
}

ItemSelector.propTypes = {
    children: PropTypes.object,
    dataTest: PropTypes.string,
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
