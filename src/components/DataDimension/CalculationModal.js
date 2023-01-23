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
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { validateExpressionMutation } from '../../api/expression.js'
import i18n from '../../locales/index.js'
import {
    parseExpressionToArray,
    parseArrayToExpression,
} from '../../modules/expressions.js'
import DataElementSelector from './DataElementSelector.js'
import FormulaField from './FormulaField.js'
import MathOperatorSelector, { getOperators } from './MathOperatorSelector.js'
import styles from './styles/CalculationModal.style.js'

const VALID_EXPRESSION = 'OK'
const INVALID_EXPRESSION = 'ERROR'

const activateAt15pixels = {
    activationConstraint: {
        distance: 15,
    },
}

const FIRST_POSITION = 0
// const LAST_POSITION = -1;
export const FIRST = 'first'
export const LAST = 'last'

const OPTIONS_PANEL = 'Sortable'

export const FIRST_DROPZONE_ID = 'firstdropzone'
export const LAST_DROPZONE_ID = 'lastdropzone'
export const FORMULA_BOX_ID = 'formulabox'

const CalculationModal = ({
    calculation = {},
    onSave,
    onClose,
    onDelete,
    displayNameProp,
}) => {
    const { show: showError } = useAlert((error) => error, { critical: true })
    const [validateExpression] = useDataMutation(validateExpressionMutation, {
        onError: (error) => showError(error),
    })
    const [validationOutput, setValidationOutput] = useState()
    const [expressionArray, setExpressionArray] = useState(
        parseExpressionToArray(calculation.expression)
    )
    const [name, setName] = useState(calculation.name)
    const [showDeletePrompt, setShowDeletePrompt] = useState()

    const sensor = useSensor(PointerSensor, activateAt15pixels)
    const sensors = useSensors(sensor)
    const [draggingId, setDraggingId] = useState(null)
    const [idCounter, setIdCounter] = useState(0)

    const expressionStatus = validationOutput?.status

    return (
        <>
            <Modal dataTest={`calculation-modal`} position="top" large>
                <ModalTitle dataTest={'calculation-modal-title'}>
                    {calculation.id
                        ? i18n.t('Data / Edit calculation')
                        : i18n.t('Data / New calculation')}
                </ModalTitle>
                <ModalContent dataTest={'calculation-modal-content'}>
                    <DndContext
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        sensors={sensors}
                    >
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
                                    onSelect={({ value }) => {
                                        setValidationOutput()
                                        setExpressionArray((prevExpression) =>
                                            prevExpression.concat([
                                                {
                                                    label: value,
                                                    value: `#{${value}}`,
                                                },
                                            ])
                                        )
                                    }}
                                />
                                <MathOperatorSelector
                                    onSelect={({ value }) => {
                                        setValidationOutput()
                                        setExpressionArray((prevExpression) =>
                                            prevExpression.concat([
                                                {
                                                    label: value,
                                                    value,
                                                },
                                            ])
                                        )
                                    }}
                                />
                            </div>
                            <div className="right-section">
                                <FormulaField
                                    expressionArray={expressionArray}
                                    setExpressionItemValue={
                                        setExpressionItemValue
                                    }
                                />
                                <p>
                                    {/* TODO: Remove, for testing only */}
                                    {parseArrayToExpression(expressionArray)}
                                </p>
                                <div className="check-button">
                                    <Button
                                        small
                                        onClick={async () =>
                                            // TODO: add loading state to button?
                                            setValidationOutput(
                                                await validateExpression({
                                                    expression:
                                                        parseArrayToExpression(
                                                            expressionArray
                                                        ),
                                                })
                                            )
                                        }
                                    >
                                        {i18n.t('Check formula')}
                                    </Button>
                                    <span
                                        className={cx('validation-message', {
                                            'validation-error':
                                                expressionStatus ===
                                                INVALID_EXPRESSION,
                                            'validation-success':
                                                expressionStatus ===
                                                VALID_EXPRESSION,
                                        })}
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
                        <style jsx>{styles}</style>
                        <DragOverlay dropAnimation={null}>
                            {draggingId ? (
                                <span className={styles.dragOverlay}>
                                    {draggingId}
                                </span>
                            ) : null}
                        </DragOverlay>
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

    function handleDragEnd({ active, over }) {
        if (
            !over?.id ||
            over?.data?.current?.sortable?.containerId === OPTIONS_PANEL
        ) {
            // dropped over non-droppable or over options panel
            handleDragCancel()
            return
        }

        const sourceAxisId = active.data.current?.sortable?.containerId
        const destAxisId = over.data.current?.sortable?.containerId || over.id

        if (sourceAxisId === OPTIONS_PANEL) {
            // adding an item to the formula
            const newItem = getNewItem(active.id)
            if (destAxisId === LAST_DROPZONE_ID) {
                setExpressionArray([...expressionArray, newItem])
            } else if (destAxisId === FORMULA_BOX_ID) {
                const destIndex = over.data.current.sortable.index
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
        } else {
            // move an item in the formula
            const sourceIndex = active.data.current.sortable.index
            let destIndex
            if (destAxisId === LAST_DROPZONE_ID) {
                destIndex = expressionArray.length
            } else if (destAxisId === FORMULA_BOX_ID) {
                destIndex = over.data.current.sortable.index
            } else {
                destIndex = FIRST_POSITION
            }
            const sourceList = Array.from(expressionArray)
            const [moved] = sourceList.splice(sourceIndex, 1)
            sourceList.splice(destIndex, 0, moved)
            setExpressionArray(sourceList)
        }
        setDraggingId(null)
    }
    function handleDragStart({ active }) {
        setDraggingId(active.id)
    }

    function handleDragCancel() {
        setDraggingId(null)
    }

    function setExpressionItemValue({ index, value }) {
        const updatedFormulaItems = expressionArray.map((expression, i) =>
            i === index ? Object.assign({}, expression, { value }) : expression
        )
        setExpressionArray(updatedFormulaItems)
    }

    function getNewItem(activeId) {
        const itemToCopy = getOperators().find(
            (operator) => operator.id === activeId
        )
        const newItem = Object.assign({}, itemToCopy, {
            id: `${activeId}-${idCounter}`,
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
