import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../modules/dataTypes.js'
import { getIcon } from '../../modules/dimensionListItem.js'
import { TYPE_DATAITEM, TYPE_INPUT } from './constants.js'
import styles from './styles/DraggingItem.style.js'

const DraggingItem = ({ item }) => {
    const displayLabel =
        item.type === TYPE_INPUT ? item.value || item.label : item.label

    return (
        <>
            <div className="draggingItem">
                <div className="iconAndLabelWrapper">
                    {item.type === TYPE_DATAITEM && (
                        <span className="icon">
                            {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                        </span>
                    )}
                    <span className="label">{displayLabel}</span>
                </div>
            </div>
            <style jsx>{styles}</style>
        </>
    )
}

DraggingItem.propTypes = {
    item: PropTypes.shape({
        label: PropTypes.string,
        sortable: PropTypes.object,
        type: PropTypes.string,
        value: PropTypes.string,
    }),
}

DraggingItem.defaultProps = {
    onClick: Function.prototype,
}

export default DraggingItem
