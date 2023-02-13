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
    TYPE_DATA_ELEMENT,
    TYPE_NUMBER,
    INVALID_EXPRESSION,
    VALID_EXPRESSION,
} from '../../modules/expressions.js'
import DataElementSelector from './DataElementSelector.js'
import DndContext, { OPTIONS_PANEL } from './DndContext.js'
import FormulaField, {
    LAST_DROPZONE_ID,
    FORMULA_BOX_ID,
} from './FormulaField.js'
import MathOperatorSelector from './MathOperatorSelector.js'
import styles from './styles/CalculationModal.style.js'

const FIRST_POSITION = 0
const LAST_POSITION = -1

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

    const [newIdCount, setNewIdCount] = useState(1)

    const [validationOutput, setValidationOutput] = useState(null)
    const [expressionArray, setExpressionArray] = useState(
        parseExpressionToArray(calculation.expression).map((item, i) => ({
            ...item,
            id: `${item.type}-${-i}`,
        }))
    )
    const [name, setName] = useState(calculation.name)
    const [showDeletePrompt, setShowDeletePrompt] = useState(false)

    const [focusItemId, setFocusItemId] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null)

    const expressionStatus = validationOutput?.status

    const selectItem = (itemId) =>
        setSelectedItemId((prevSelected) =>
            prevSelected !== itemId ? itemId : null
        )

    const removeItem = (itemId) => {
        if (itemId !== null) {
            setValidationOutput()
            const index = expressionArray.findIndex(
                (item) => item.id === itemId
            )
            const sourceList = Array.from(expressionArray)
            sourceList.splice(index, 1)
            setExpressionArray(sourceList)
            setSelectedItemId(null)
        }
    }

    const addItem = ({ label, value, type, destIndex = LAST_POSITION }) => {
        setValidationOutput()

        const newItem = {
            id: `${type}-${newIdCount}`,
            value: type === TYPE_DATA_ELEMENT ? `#{${value}}` : value,
            label,
            type,
        }

        setNewIdCount(newIdCount + 1)

        if (destIndex === LAST_POSITION) {
            setExpressionArray((prevArray) => prevArray.concat([newItem]))
        } else if (destIndex === FIRST_POSITION) {
            setExpressionArray((prevArray) => [newItem].concat(prevArray))
        } else {
            const items = Array.from(expressionArray)
            const newFormulaItems = [
                ...items.slice(0, destIndex),
                newItem,
                ...items.slice(destIndex),
            ]
            setExpressionArray(newFormulaItems)
        }

        if (newItem.type === TYPE_NUMBER) {
            setFocusItemId(newItem.id)
        }
    }

    const moveItem = ({ sourceIndex, destIndex }) => {
        setValidationOutput()
        const sourceList = Array.from(expressionArray)
        const [moved] = sourceList.splice(sourceIndex, 1)
        sourceList.splice(destIndex, 0, moved)
        setExpressionArray(sourceList)
    }

    const setItemValue = ({ itemId, value }) => {
        const updatedItems = expressionArray.map((item) =>
            item.id === itemId ? Object.assign({}, item, { value }) : item
        )
        setExpressionArray(updatedItems)
    }

    const validate = async () => {
        const expression = parseArrayToExpression(expressionArray)
        let result = validateExpression(expression)
        if (!result) {
            result = await doBackendValidation({
                expression,
            })
        }
        setValidationOutput(result)
    }

    const addOrMoveDraggedItem = ({ item, destination }) => {
        const destContainerId = destination.containerId

        let destIndex = FIRST_POSITION
        if (item.sourceContainerId === OPTIONS_PANEL) {
            if (destContainerId === LAST_DROPZONE_ID) {
                destIndex = LAST_POSITION
            } else if (destContainerId === FORMULA_BOX_ID) {
                destIndex = destination.index + 1
            }

            addItem({ ...item.data, destIndex })
        } else {
            if (destContainerId === LAST_DROPZONE_ID) {
                destIndex = expressionArray.length
            } else if (destContainerId === FORMULA_BOX_ID) {
                destIndex = destination.index
            }

            moveItem({ sourceIndex: item.sourceIndex, destIndex })
        }
    }

    return (
        <>
            <Modal dataTest="calculation-modal" position="top" large>
                <ModalTitle dataTest="calculation-modal-title">
                    {calculation.id
                        ? i18n.t('Data / Edit calculation')
                        : i18n.t('Data / New calculation')}
                </ModalTitle>
                <ModalContent dataTest="calculation-modal-content">
                    <DndContext
                        onDragStart={() => setFocusItemId(null)}
                        onDragEnd={addOrMoveDraggedItem}
                    >
                        <div className="name-input">
                            <InputField
                                label={i18n.t(
                                    'Label shown in column/row headers'
                                )}
                                onChange={({ value }) => setName(value)}
                                value={name}
                                dataTest="calculation-label"
                            />
                        </div>
                        <div className="content">
                            <div className="left-section">
                                <DataElementSelector
                                    displayNameProp={displayNameProp}
                                    onDoubleClick={addItem}
                                />
                                <MathOperatorSelector onDoubleClick={addItem} />
                            </div>
                            <div className="right-section">
                                <FormulaField
                                    items={expressionArray}
                                    selectedItemId={selectedItemId}
                                    focusItemId={focusItemId}
                                    onChange={setItemValue}
                                    onClick={selectItem}
                                    onDoubleClick={removeItem}
                                />
                                <div className="formula-actions">
                                    <p>
                                        {/* TODO: Remove, for testing only */}
                                        {parseArrayToExpression(
                                            expressionArray
                                        )}
                                    </p>
                                    <div className="actions-wrapper">
                                        <Button
                                            small
                                            onClick={validate}
                                            dataTest="validate-button"
                                        >
                                            {/* TODO: add loading state to button? */}
                                            {i18n.t('Check formula')}
                                        </Button>
                                        {selectedItemId !== null && (
                                            <div className="remove-button">
                                                <Button
                                                    small
                                                    onClick={() =>
                                                        removeItem(
                                                            selectedItemId
                                                        )
                                                    }
                                                    dataTest="remove-button"
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
                                            data-test={'validation-message'}
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
                                                dataTest="delete-button"
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
                <ModalActions dataTest="calculation-modal-actions">
                    <ButtonStrip>
                        <Button onClick={onClose} dataTest="cancel-button">
                            {i18n.t('Cancel')}
                        </Button>
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
                                        dataTest="save-button"
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
