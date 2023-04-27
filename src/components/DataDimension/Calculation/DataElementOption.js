import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import { DIMENSION_TYPE_DATA_ELEMENT } from '../../../modules/dataTypes.js'
import { getIcon } from '../../../modules/dimensionListItem.js'
import { EXPRESSION_TYPE_DATA } from '../../../modules/expressions.js'
import styles from './styles/DataElementOption.style.js'

const DataElementOption = ({ label, value, onDoubleClick }) => {
    const data = { label, value, type: EXPRESSION_TYPE_DATA }
    const { attributes, listeners, setNodeRef, transform } = useSortable({
        id: value,
        data,
    })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <div className="wrapper">
            <div
                className="draggable-item"
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                style={style}
            >
                <div
                    className="chip"
                    onDoubleClick={() => onDoubleClick(data)}
                    data-test="data-element-option"
                >
                    <span className="icon">
                        {getIcon(DIMENSION_TYPE_DATA_ELEMENT)}
                    </span>
                    <span className="label">{label}</span>
                </div>
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}

DataElementOption.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onDoubleClick: PropTypes.func,
}

export default DataElementOption
