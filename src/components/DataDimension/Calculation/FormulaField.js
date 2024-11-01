import { Center, CircularLoader } from '@dhis2/ui'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import PropTypes from 'prop-types'
import React from 'react'
import FormulaIcon from '../../../assets/FormulaIcon.js'
import i18n from '../../../locales/index.js'
import DropZone from './DropZone.js'
import FormulaItem from './FormulaItem.js'
import styles from './styles/FormulaField.style.js'

export const LAST_DROPZONE_ID = 'lastdropzone'
export const FORMULA_BOX_ID = 'formulabox'

const Placeholder = () => (
    <div className="placeholder" data-test="placeholder">
        <FormulaIcon />
        <span className="help-text">
            {i18n.t(
                'Drag items here, or double click in the list, to start building a calculation formula'
            )}
        </span>
        <style jsx>{styles}</style>
    </div>
)

const FormulaField = ({
    items = [],
    selectedItemId,
    focusItemId,
    onChange,
    onClick,
    onDoubleClick,
    loading,
}) => {
    const { over, setNodeRef: setLastDropzoneRef } = useDroppable({
        id: LAST_DROPZONE_ID,
    })

    const itemIds = items.map((item) => item.id)

    const overLastDropZone = over?.id === LAST_DROPZONE_ID

    return (
        <div className="container">
            <div className="border"></div>
            <div
                className="formula-field"
                ref={setLastDropzoneRef}
                data-test="formula-field"
            >
                {loading && (
                    <Center>
                        <CircularLoader small />
                    </Center>
                )}
                {!loading && itemIds && (
                    <SortableContext id={FORMULA_BOX_ID} items={itemIds}>
                        <DropZone
                            firstElementId={itemIds[0]}
                            overLastDropZone={overLastDropZone}
                        />
                        {!items.length && <Placeholder />}
                        {Boolean(items.length) &&
                            items.map(({ id, label, type, value }, index) => (
                                <FormulaItem
                                    key={id}
                                    id={id}
                                    label={label}
                                    type={type}
                                    value={value}
                                    hasFocus={focusItemId === id}
                                    isHighlighted={selectedItemId === id}
                                    isLast={index === items.length - 1}
                                    onChange={onChange}
                                    onClick={onClick}
                                    onDoubleClick={onDoubleClick}
                                    overLastDropZone={overLastDropZone}
                                />
                            ))}
                    </SortableContext>
                )}
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}

FormulaField.propTypes = {
    onChange: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    focusItemId: PropTypes.string,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            label: PropTypes.string,
            type: PropTypes.string,
            value: PropTypes.string,
        })
    ),
    loading: PropTypes.bool,
    selectedItemId: PropTypes.string,
}

export default FormulaField
