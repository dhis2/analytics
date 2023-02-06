import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    InputField,
    Tooltip,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { validateExpressionMutation } from '../../api/expression.js'
import i18n from '../../locales/index.js'
import {
    parseExpressionToArray,
    parseArrayToExpression,
    validateExpression,
    INVALID_EXPRESSION,
    VALID_EXPRESSION,
} from '../../modules/expressions.js'
import {
    TYPE_DATAELEMENT,
    TYPE_INPUT,
    LAST_DROPZONE_ID,
    FORMULA_BOX_ID,
} from './constants.js'
import DataElementSelector from './DataElementSelector.js'
import DndContext, { OPTIONS_PANEL } from './DndContext.js'
import FormulaField from './FormulaField.js'
import MathOperatorSelector, { getOperators } from './MathOperatorSelector.js'
import styles from './styles/CalculationModal.style.js'

const FIRST_POSITION = 0

const CalculationModal = ({
    calculation = {},
    onSave,
    onClose,
    onDelete,
    displayNameProp,
}) => {
    const { show: showError } = useAlert((error) => error, { critical: true })
    const [doBackendValidation] = useDataMutation(validateExpressionMutation, {
        onError: (error) => showError(error),
    })
    const [validationOutput, setValidationOutput] = useState(null)
    const [expressionArray, setExpressionArray] = useState(
        parseExpressionToArray(calculation.expression)
    )
    const [name, setName] = useState(calculation.name)
    const [showDeletePrompt, setShowDeletePrompt] = useState(false)

    const [focusId, setFocusId] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [idCounter, setIdCounter] = useState(0)

    const expressionStatus = validationOutput?.status

    const selectItem = (id) =>
        setSelectedId((prevSelected) => (prevSelected !== id ? id : null))

    const removeItem = (id) => {
        setValidationOutput()
        const sourceList = Array.from(expressionArray)
        const index = sourceList.findIndex((item) => item.id === id)
        sourceList.splice(index, 1)
        setExpressionArray(sourceList)
    }

    const setItemValue = ({ index, value }) => {
        const updatedItems = expressionArray.map((expression, i) =>
            i === index ? Object.assign({}, expression, { value }) : expression
        )
        setExpressionArray(updatedItems)
    }

    const validate = async () => {
        const expression = parseArrayToExpression(expressionArray)
        let result = validateExpression(expression)
        if (!result.length) {
            result = await doBackendValidation({
                expression,
            })
        }
        setValidationOutput(result)
    }

    return (
        <>
            <Modal dataTest={`calculation-modal`} position="top" large>
                <ModalTitle dataTest={'calculation-modal-title'}>
                    {calculation.id
                        ? i18n.t('Data / Edit calculation')
                        : i18n.t('Data / New calculation')}
                </ModalTitle>
                <ModalContent dataTest={'calculation-modal-content'}>
                    <DndContext onDragEnd={addOrMoveDraggedItem}>
                        <div className="name-input">
                            <InputField
                                label={i18n.t(
                                    'Label shown in column/row headers'
                                )}
                                onChange={({ value }) => setName(value)}
                                value={name}
                            />
                        </div>
                        <div className="content">
                            <div className="left-section">
                                <DataElementSelector
                                    displayNameProp={displayNameProp}
                                    onSelect={({ label, value }) => {
                                        setValidationOutput()
                                        setExpressionArray((prevArray) =>
                                            prevArray.concat([
                                                getNewDataItem(value, label),
                                            ])
                                        )
                                    }}
                                />
                                <MathOperatorSelector
                                    onSelect={({ id }) => {
                                        setValidationOutput()
                                        const newItem = getNewOperatorItem(id)
                                        if (newItem.type === TYPE_INPUT) {
                                            setFocusId(newItem.id)
                                        }
                                        setExpressionArray((prevArray) =>
                                            prevArray.concat([newItem])
                                        )
                                    }}
                                />
                            </div>
                            <div className="right-section">
                                <FormulaField
                                    items={expressionArray}
                                    selectedId={selectedId}
                                    focusId={focusId}
                                    onChange={setItemValue}
                                    onClick={selectItem}
                                    onDoubleClick={removeItem}
                                />
                                <div className="leftpad">
                                    <p>
                                        {/* TODO: Remove, for testing only */}
                                        {parseArrayToExpression(
                                            expressionArray
                                        )}
                                    </p>
                                    <div className="actions-wrapper">
                                        <Button small onClick={validate}>
                                            {/* TODO: add loading state to button? */}
                                            {i18n.t('Check formula')}
                                        </Button>
                                        {(selectedId || selectedId === 0) && (
                                            <div className={'remove-button'}>
                                                <Button
                                                    small
                                                    onClick={() =>
                                                        removeItem(selectedId)
                                                    }
                                                >
                                                    {i18n.t('Remove item')}
                                                </Button>
                                            </div>
                                        )}
                                        <span
                                            className={cx(
                                                'validation-message',
                                                {
                                                    'validation-error':
                                                        expressionStatus ===
                                                        INVALID_EXPRESSION,
                                                    'validation-success':
                                                        expressionStatus ===
                                                        VALID_EXPRESSION,
                                                }
                                            )}
                                        >
                                            {validationOutput?.message}
                                        </span>
                                    </div>
                                    {calculation.id && (
                                        <div className="delete-button">
                                            <Button
                                                small
                                                onClick={() =>
                                                    setShowDeletePrompt(true)
                                                }
                                            >
                                                {i18n.t('Delete calculation')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <style jsx>{styles}</style>
                    </DndContext>
                </ModalContent>
                <ModalActions dataTest={'calculation-modal-actions'}>
                    <ButtonStrip>
                        <Button onClick={onClose}>{i18n.t('Cancel')}</Button>
                        <Tooltip
                            content={
                                expressionStatus !== VALID_EXPRESSION
                                    ? i18n.t(
                                          'The calculation can only be saved with a valid formula'
                                      )
                                    : i18n.t(
                                          'Add a name to save this calculation'
                                      )
                            }
                            placement="top"
                            closeDelay={200}
                        >
                            {({ ref, onMouseOver, onMouseOut }) => (
                                <span
                                    ref={ref}
                                    onMouseOver={
                                        expressionStatus !== VALID_EXPRESSION ||
                                        !name
                                            ? onMouseOver
                                            : undefined
                                    }
                                    onMouseOut={
                                        expressionStatus !== VALID_EXPRESSION ||
                                        !name
                                            ? onMouseOut
                                            : undefined
                                    }
                                    className="tooltip"
                                >
                                    <Button
                                        primary
                                        onClick={() =>
                                            onSave({
                                                id: calculation.id,
                                                expression:
                                                    parseArrayToExpression(
                                                        expressionArray
                                                    ),
                                                name,
                                            })
                                        }
                                        disabled={
                                            expressionStatus !==
                                                VALID_EXPRESSION || !name
                                        }
                                    >
                                        {i18n.t('Save calculation')}
                                    </Button>
                                </span>
                            )}
                        </Tooltip>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
            {showDeletePrompt && (
                <Modal small>
                    <ModalTitle>{i18n.t('Delete calculation')}</ModalTitle>
                    <ModalContent>
                        {i18n.t(
                            'Are you sure you want to delete this calculation? It may be used by other visualizations.'
                        )}
                    </ModalContent>
                    <ModalActions>
                        <ButtonStrip end>
                            <Button
                                secondary
                                onClick={() => setShowDeletePrompt()}
                            >
                                {i18n.t('Cancel')}
                            </Button>

                            <Button
                                onClick={() => {
                                    setShowDeletePrompt()
                                    onDelete({
                                        id: calculation.id,
                                    })
                                }}
                                destructive
                            >
                                {i18n.t('Yes, delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
        </>
    )

    function addOrMoveDraggedItem({ activeItem, over }) {
        const sourceAxisId = activeItem.sourceAxisId
        const destAxisId = over.axisId

        if (sourceAxisId === OPTIONS_PANEL) {
            let newItem
            if (activeItem.data.type === TYPE_DATAELEMENT) {
                newItem = getNewDataItem(
                    activeItem.data.id,
                    activeItem.data.label
                )
            } else {
                // adding an item to the formula
                newItem = getNewOperatorItem(activeItem.id)
            }

            if (destAxisId === LAST_DROPZONE_ID) {
                setExpressionArray([...expressionArray, newItem])
            } else if (destAxisId === FORMULA_BOX_ID) {
                const destIndex = over.index + 1
                const sourceList = Array.from(expressionArray)

                const newFormulaItems = [
                    ...sourceList.slice(0, destIndex),
                    newItem,
                    ...sourceList.slice(destIndex),
                ]

                setExpressionArray(newFormulaItems)
            } else {
                setExpressionArray([newItem, ...expressionArray])
            }
            if (newItem.type === TYPE_INPUT) {
                setFocusId(newItem.id)
            }
        } else {
            // move an item in the formula
            const sourceIndex = activeItem.sourceIndex
            let destIndex
            if (destAxisId === LAST_DROPZONE_ID) {
                destIndex = expressionArray.length
            } else if (destAxisId === FORMULA_BOX_ID) {
                destIndex = over.index
            } else {
                destIndex = FIRST_POSITION
            }
            const sourceList = Array.from(expressionArray)
            const [moved] = sourceList.splice(sourceIndex, 1)
            sourceList.splice(destIndex, 0, moved)
            setExpressionArray(sourceList)
        }
    }

    function getNewDataItem(id, label) {
        const newItem = {
            id: `${id}-${idCounter}`,
            value: `#{${id}}`,
            label: label,
            type: TYPE_DATAELEMENT,
        }
        setIdCounter(idCounter + 1)
        return newItem
    }

    function getNewOperatorItem(id) {
        const itemToCopy = getOperators().find((op) => op.id === id)
        const newItem = Object.assign({}, itemToCopy, {
            id: `${id}-${idCounter}`,
        })

        setIdCounter(idCounter + 1)
        return newItem
    }
}

CalculationModal.propTypes = {
    displayNameProp: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    calculation: PropTypes.shape({
        expression: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
    }),
}

export default CalculationModal
