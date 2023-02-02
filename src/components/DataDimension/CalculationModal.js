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
import {
    TYPE_DATAITEM,
    TYPE_INPUT,
    TYPE_OPERATOR,
    LAST_DROPZONE_ID,
    FORMULA_BOX_ID,
} from './constants.js'
import DataElementSelector from './DataElementSelector.js'
import DraggingItem from './DraggingItem.js'
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

const OPTIONS_PANEL = 'Sortable'

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
    const [validationOutput, setValidationOutput] = useState()
    const [expressionArray, setExpressionArray] = useState(
        parseExpressionToArray(calculation.expression)
    )
    const [name, setName] = useState(calculation.name)
    const [showDeletePrompt, setShowDeletePrompt] = useState()

    const sensor = useSensor(PointerSensor, activateAt15pixels)
    const sensors = useSensors(sensor)
    const [draggingItem, setDraggingItem] = useState(null)
    const [idCounter, setIdCounter] = useState(0)

    const expressionStatus = validationOutput?.status

    const [selectedPart, setSelectedPart] = useState()
    const onPartSelection = (index) => {
        setSelectedPart((prevSelected) =>
            prevSelected !== index ? index : null
        )
    }

    const validateExpression = async () => {
        const expression = parseArrayToExpression(expressionArray)
        let result = ''
        // TODO: two numbers next to each other

        const leftParenthesisCount = expression.split('(').length - 1
        const rightParenthesisCount = expression.split(')').length - 1

        if (!expression) {
            // empty formula
            result = {
                status: INVALID_EXPRESSION,
                message: i18n.t('Empty formula'),
            }
        } else if (/[-+/*]{2,}/.test(expression)) {
            // two math operators next to each other
            result = {
                status: INVALID_EXPRESSION,
                message: i18n.t('Consecutive math operators'),
            }
        } else if (/}#/.test(expression)) {
            // two data elements next to each other
            result = {
                status: INVALID_EXPRESSION,
                message: i18n.t('Consecutive data elements'),
            }
        } else if (/^[+\-*/]|[+\-*/]$/.test(expression)) {
            // starting or ending with a math operator
            result = {
                status: INVALID_EXPRESSION,
                message: i18n.t('Starts or ends with a math operator'),
            }
        } else if (leftParenthesisCount > rightParenthesisCount) {
            // ( but no )
            result = {
                status: INVALID_EXPRESSION,
                message: i18n.t('Missing right parenthesis )'),
            }
        } else if (rightParenthesisCount > leftParenthesisCount) {
            // ) but no (
            result = {
                status: INVALID_EXPRESSION,
                message: i18n.t('Missing left parenthesis ('),
            }
        } else {
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
                    <DndContext
                        collisionDetection={rectIntersectionCustom}
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
                                        setExpressionArray((prevArray) =>
                                            prevArray.concat([
                                                getNewOperatorItem(id),
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
                                    onPartSelection={onPartSelection}
                                    selectedPart={selectedPart}
                                />
                                <p>
                                    {/* TODO: Remove, for testing only */}
                                    {parseArrayToExpression(expressionArray)}
                                </p>
                                <div className="actions-wrapper">
                                    <Button small onClick={validateExpression}>
                                        {/* TODO: add loading state to button? */}
                                        {i18n.t('Check formula')}
                                    </Button>
                                    {(selectedPart || selectedPart === 0) && (
                                        <div className={'remove-button'}>
                                            <Button
                                                small
                                                onClick={() => {
                                                    setValidationOutput()
                                                    setExpressionArray(
                                                        (prevArray) =>
                                                            prevArray.filter(
                                                                (_, index) =>
                                                                    index !=
                                                                    selectedPart
                                                            )
                                                    )
                                                    setSelectedPart()
                                                }}
                                            >
                                                {i18n.t('Remove item')}
                                            </Button>
                                        </div>
                                    )}
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
                                <p>
                                    <span>Data element dragging item: </span>
                                    <DraggingItem
                                        item={{
                                            type: TYPE_DATAITEM,
                                            label: 'ANC 4th or more visits',
                                        }}
                                    />
                                </p>
                                <p>
                                    <span>Number dragging item: </span>
                                    <DraggingItem
                                        item={{
                                            type: TYPE_INPUT,
                                            label: '<number>+',
                                            value: '55',
                                        }}
                                    />
                                </p>
                                <p>
                                    <span>
                                        Number dragging item w/o value:{' '}
                                    </span>
                                    <DraggingItem
                                        item={{
                                            type: TYPE_INPUT,
                                            label: '<number>+',
                                            value: '',
                                        }}
                                    />
                                </p>
                                <p>
                                    <span>Operator dragging item: </span>
                                    <DraggingItem
                                        item={{
                                            type: TYPE_OPERATOR,
                                            label: '+',
                                            value: '+',
                                        }}
                                    />
                                </p>
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
                            {draggingItem ? (
                                <span className="dragOverlay">
                                    <DraggingItem item={draggingItem} />
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
            let newItem
            if (active.data.current.type === TYPE_DATAITEM) {
                newItem = getNewDataItem(
                    active.data.current.id,
                    active.data.current.label
                )
            } else {
                // adding an item to the formula
                newItem = getNewOperatorItem(active.id)
            }

            if (destAxisId === LAST_DROPZONE_ID) {
                setExpressionArray([...expressionArray, newItem])
            } else if (destAxisId === FORMULA_BOX_ID) {
                const destIndex = over.data.current.sortable.index + 1
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
        setDraggingItem(null)
    }
    function handleDragStart({ active }) {
        console.log('setDraggingitem', active.data.current)
        setDraggingItem(active.data.current)
    }

    function handleDragCancel() {
        setDraggingItem(null)
    }

    function setExpressionItemValue({ index, value }) {
        const updatedFormulaItems = expressionArray.map((expression, i) =>
            i === index ? Object.assign({}, expression, { value }) : expression
        )
        setExpressionArray(updatedFormulaItems)
    }

    function getNewDataItem(id, label) {
        const newItem = {
            id: `${id}-${idCounter}`,
            value: `#{${id}}`,
            label: label,
            type: TYPE_DATAITEM,
        }
        setIdCounter(idCounter + 1)
        return newItem
    }

    function getNewOperatorItem(id) {
        const itemToCopy = getOperators().find((operator) => operator.id === id)
        const newItem = Object.assign({}, itemToCopy, {
            id: `${id}-${idCounter}`,
        })

        setIdCounter(idCounter + 1)
        return newItem
    }

    function getIntersectionRatio(entry, target) {
        const top = Math.max(target.top, entry.top)
        const left = Math.max(target.left, entry.left)
        const right = Math.min(
            target.left + target.width,
            entry.left + entry.width
        )
        const bottom = Math.min(
            target.top + target.height,
            entry.top + entry.height
        )
        const width = right - left
        const height = bottom - top

        if (left < right && top < bottom) {
            const targetArea = target.width * target.height
            const entryArea = entry.width * entry.height
            const intersectionArea = width * height
            const intersectionRatio =
                intersectionArea / (targetArea + entryArea - intersectionArea)
            return Number(intersectionRatio.toFixed(4))
        } // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)

        return 0
    }
    function sortCollisionsDesc(
        { data: { value: a } },
        { data: { value: b } }
    ) {
        return b - a
    }

    function rectIntersectionCustom({
        pointerCoordinates,
        droppableContainers,
    }) {
        // create a rect around the pointerCoords for calculating the intersection
        const pointerRect = {
            width: 80,
            height: 40,
            top: pointerCoordinates.y - 20,
            bottom: pointerCoordinates.y + 20,
            left: pointerCoordinates.x - 40,
            right: pointerCoordinates.x + 40,
        }
        const collisions = []

        for (const droppableContainer of droppableContainers) {
            const {
                id,
                rect: { current: rect },
            } = droppableContainer

            if (rect) {
                const intersectionRatio = getIntersectionRatio(
                    rect,
                    pointerRect
                )

                if (intersectionRatio > 0) {
                    collisions.push({
                        id,
                        data: {
                            droppableContainer,
                            value: intersectionRatio,
                        },
                    })
                }
            }
        }

        return collisions.sort(sortCollisionsDesc)
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
