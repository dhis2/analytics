import { useAlert, useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Help,
    InputField,
    NoticeBox,
    Popper,
    Portal,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import {
    createCalculationMutation,
    deleteCalculationMutation,
    updateCalculationMutation,
    validateIndicatorExpressionMutation,
} from '../../../api/expression.js'
import i18n from '../../../locales/index.js'
import {
    parseExpressionToArray,
    parseArrayToExpression,
    validateExpression,
    getOperators,
    EXPRESSION_TYPE_DATA,
    EXPRESSION_TYPE_NUMBER,
    EXPRESSION_TYPE_OPERATOR,
    INVALID_EXPRESSION,
    VALID_EXPRESSION,
    getItemIdsFromExpression,
} from '../../../modules/expressions.js'
import { OfflineTooltip as Tooltip } from '../../OfflineTooltip.js'
import DataElementSelector from './DataElementSelector.js'
import DndContext, {
    OPTIONS_PANEL,
    isInteractiveElement,
} from './DndContext.js'
import FormulaField, {
    LAST_DROPZONE_ID,
    FORMULA_BOX_ID,
} from './FormulaField.js'
import MathOperatorSelector from './MathOperatorSelector.js'
import styles from './styles/CalculationModal.style.js'

const FIRST_POSITION = 0
const LAST_POSITION = -1
const CALCULATION_PROP_DEFAULT = {}
const OPERATORS = getOperators()

const Key = ({ children }) => (
    <kbd className="key">
        {children}
        <style jsx>{styles}</style>
    </kbd>
)

Key.propTypes = {
    children: PropTypes.node.isRequired,
}

const ShortcutsPopoverContent = () => (
    <div className="shortcuts">
        <ul>
            <li>
                <span className="shortcut-keys">
                    <Key>Enter</Key>
                    <Key>Space</Key>
                </span>
                {i18n.t('Add or select the focused item')}
            </li>
            <li>
                <span className="shortcut-keys">
                    <Key>←</Key>
                    <Key>→</Key>
                </span>
                {i18n.t('Move the selected item')}
            </li>
            <li>
                <span className="shortcut-keys">
                    <Key>+</Key>
                    <Key>-</Key>
                    <Key>*</Key>
                    <Key>/</Key>
                    <Key>(</Key>
                    <Key>)</Key>
                </span>
                {i18n.t('Insert an operator after the selected item')}
            </li>
        </ul>
        <style jsx>{styles}</style>
    </div>
)

const KeyboardNavigationHint = () => {
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef()

    return (
        <span className="hint">
            <button
                type="button"
                className="hint-trigger"
                ref={triggerRef}
                data-test="keyboard-navigation-hint"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
            >
                {i18n.t('Keyboard navigation')}
            </button>
            {isOpen && (
                <Portal>
                    <Popper placement="top-start" reference={triggerRef}>
                        <ShortcutsPopoverContent />
                    </Popper>
                </Portal>
            )}
            <style jsx>{styles}</style>
        </span>
    )
}

const CalculationModal = ({
    calculation = CALCULATION_PROP_DEFAULT,
    onSave,
    onClose,
    onDelete,
    displayNameProp,
    height,
}) => {
    const { show: showError } = useAlert((error) => error, { critical: true })
    const mutationParams = { onError: (error) => showError(error) }
    const [createCalculation, { loading: isCreatingCalculation }] =
        useDataMutation(createCalculationMutation, mutationParams)
    const [updateCalculation, { loading: isUpdatingCalculation }] =
        useDataMutation(updateCalculationMutation, mutationParams)
    const [deleteCalculation, { loading: isDeletingCalculation }] =
        useDataMutation(deleteCalculationMutation, mutationParams)
    const [doBackendValidation, { loading: isValidating }] = useDataMutation(
        validateIndicatorExpressionMutation,
        {
            onError: (error) =>
                showError(
                    error?.message ||
                        error ||
                        i18n.t('Could not validate the formula')
                ),
        }
    )

    const query = {
        dataElements: {
            resource: 'dataElements',
            params: ({ ids = [] }) => ({
                fields: `id,${displayNameProp}~rename(name)`,
                filter: `id:in:[${ids.join(',')}]`,
                paging: false,
            }),
        },
        dataElementOperands: {
            resource: 'dataElementOperands',
            params: ({ ids = [] }) => ({
                fields: `id,${displayNameProp}~rename(name)`,
                filter: `id:in:[${ids.join(',')}]`,
                paging: false,
            }),
        },
    }

    const { data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        const ids = getItemIdsFromExpression(calculation.expression)

        // only fetch data if there are ids
        if (ids?.length) {
            refetch({ ids })
        } else {
            setExpressionArray(
                parseExpressionToArray(calculation.expression).map(
                    (item, i) => ({
                        ...item,
                        id: `${item.type}-${-i}`,
                    })
                )
            )
        }
    }, [refetch, calculation.expression])

    useEffect(() => {
        if (data) {
            const metadata = [
                ...(data.dataElements?.dataElements || []),
                ...(data.dataElementOperands?.dataElementOperands || []),
            ]

            setExpressionArray(
                parseExpressionToArray(calculation.expression, metadata).map(
                    (item, i) => ({
                        ...item,
                        id: `${item.type}-${-i}`,
                    })
                )
            )
        }
    }, [data, calculation.expression])

    const nextItemIdRef = useRef(1)
    // State is read through this ref instead of a closure, so the
    // document-level keydown listener can be registered once on mount
    // and still see fresh state on every keystroke.
    const latestRef = useRef()

    const [validationOutput, setValidationOutput] = useState(null)
    const [expressionArray, setExpressionArray] = useState()
    const [name, setName] = useState(calculation.name)
    const [showDeletePrompt, setShowDeletePrompt] = useState(false)
    const [isSavingCalculation, setIsSavingCalculation] = useState()

    const [focusItemId, setFocusItemId] = useState(null)
    const [selectedItemId, setSelectedItemId] = useState(null)

    const expressionStatus = validationOutput?.status
    const validationMessage =
        expressionStatus === VALID_EXPRESSION
            ? i18n.t('The formula is valid')
            : validationOutput?.message

    const selectItem = (itemId) =>
        setSelectedItemId((prevSelected) => {
            const next = prevSelected !== itemId ? itemId : null
            if (latestRef.current) {
                latestRef.current.selectedItemId = next
            }
            return next
        })

    const isLoading =
        isCreatingCalculation ||
        isUpdatingCalculation ||
        isDeletingCalculation ||
        isSavingCalculation ||
        isValidating

    const addItem = ({ label, value, type, destIndex }) => {
        if (isLoading || !expressionArray) {
            return
        }
        setValidationOutput(null)

        const newItem = {
            id: `${type}-${nextItemIdRef.current++}`,
            value: type === EXPRESSION_TYPE_DATA ? `#{${value}}` : value,
            label,
            type,
        }

        // Without an explicit destIndex, insert after the selected item
        // instead of always appending.
        const selectedId = latestRef.current?.selectedItemId
        setExpressionArray((prevArray) => {
            let insertAt = destIndex
            if (insertAt === undefined) {
                const selectedIndex = prevArray.findIndex(
                    (item) => item.id === selectedId
                )
                insertAt =
                    selectedIndex === -1 ? prevArray.length : selectedIndex + 1
            } else if (insertAt === LAST_POSITION) {
                insertAt = prevArray.length
            }

            return [
                ...prevArray.slice(0, insertAt),
                newItem,
                ...prevArray.slice(insertAt),
            ]
        })

        if (newItem.type === EXPRESSION_TYPE_NUMBER) {
            setFocusItemId(newItem.id)
        }

        // Keep the newly added item selected so it becomes the anchor for
        // the next typed operator or arrow-key move.
        setSelectedItemId(newItem.id)
        latestRef.current.selectedItemId = newItem.id
    }

    const moveItem = ({ sourceIndex, destIndex }) => {
        if (isLoading) {
            return
        }
        setValidationOutput(null)
        setExpressionArray((prevArray) => {
            const sourceList = Array.from(prevArray)
            const [moved] = sourceList.splice(sourceIndex, 1)
            sourceList.splice(destIndex, 0, moved)
            return sourceList
        })
    }

    const setItemValue = ({ itemId, value }) => {
        const updatedItems = expressionArray.map((item) =>
            item.id === itemId ? Object.assign({}, item, { value }) : item
        )
        setExpressionArray(updatedItems)
    }

    const removeItem = (itemId) => {
        if (!isLoading && itemId !== null) {
            setValidationOutput(null)
            const index = expressionArray.findIndex(
                (item) => item.id === itemId
            )
            const sourceList = Array.from(expressionArray)
            sourceList.splice(index, 1)
            setExpressionArray(sourceList)
            setSelectedItemId(null)
        }
    }

    latestRef.current = {
        isLoading,
        showDeletePrompt,
        selectedItemId,
        expressionArray,
        addItem,
        moveItem,
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const {
                isLoading,
                showDeletePrompt,
                selectedItemId,
                expressionArray,
                addItem,
                moveItem,
            } = latestRef.current

            // On some layouts (e.g. German, French) operator characters
            // like ( ) * are typed via AltGr, which browsers report as
            // altKey/ctrlKey being set - don't let that block the shortcut.
            const isAltGraph = event.getModifierState?.('AltGraph')

            if (
                isLoading ||
                showDeletePrompt ||
                event.metaKey ||
                (!isAltGraph && (event.ctrlKey || event.altKey)) ||
                isInteractiveElement(event.target)
            ) {
                return
            }

            const operator = OPERATORS.find(
                (op) =>
                    op.type === EXPRESSION_TYPE_OPERATOR &&
                    op.value === event.key
            )

            if (operator) {
                event.preventDefault()
                addItem(operator)
                return
            }

            if (!selectedItemId || !expressionArray) {
                return
            }

            const index = expressionArray.findIndex(
                (item) => item.id === selectedItemId
            )
            if (index === -1) {
                return
            }

            if (event.key === 'ArrowLeft' && index > 0) {
                event.preventDefault()
                moveItem({ sourceIndex: index, destIndex: index - 1 })
            } else if (
                event.key === 'ArrowRight' &&
                index < expressionArray.length - 1
            ) {
                event.preventDefault()
                moveItem({ sourceIndex: index, destIndex: index + 1 })
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

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

    const validate = async () => {
        setValidationOutput(null)
        const expression = parseArrayToExpression(expressionArray)
        let result = validateExpression(expression)

        if (!result) {
            const backendResult = await doBackendValidation({
                expression,
            })

            // useDataMutation never rejects; network/engine failures go to
            // onError and this promise does not resolve.
            if (!backendResult) {
                return
            }

            if (backendResult.status === INVALID_EXPRESSION) {
                result = backendResult
            } else {
                result = {
                    ...backendResult,
                    status: VALID_EXPRESSION,
                }
            }
        }

        setValidationOutput(result)

        return result?.status
    }

    const onSaveClick = async () => {
        setIsSavingCalculation(true)
        let status = expressionStatus

        if (status !== VALID_EXPRESSION) {
            status = await validate()
        }

        if (status === VALID_EXPRESSION) {
            let response
            const expression = parseArrayToExpression(expressionArray)

            if (calculation.id) {
                response = await updateCalculation({
                    id: calculation.id,
                    name,
                    expression,
                })
            } else {
                response = await createCalculation({
                    name,
                    expression,
                })
            }

            onSave({
                id: calculation.id || response?.response.uid,
                name,
                isNew: !calculation.id,
                expression,
            })
        }
        setIsSavingCalculation(false)
    }

    const onDeleteClick = async () => {
        setShowDeletePrompt()
        await deleteCalculation({ id: calculation.id })
        onDelete({
            id: calculation.id,
        })
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
                    <div className="name-field">
                        <InputField
                            label={i18n.t('Calculation name')}
                            helpText={i18n.t(
                                'Shown in table headers and chart axes/legends'
                            )}
                            onChange={({ value }) =>
                                setName(value.substr(0, 50))
                            }
                            value={name}
                            dataTest="calculation-label"
                            dense
                        />
                    </div>
                    <DndContext
                        onDragStart={() => setFocusItemId(null)}
                        onDragEnd={addOrMoveDraggedItem}
                    >
                        <div className="content">
                            <div className="left-section">
                                <DataElementSelector
                                    displayNameProp={displayNameProp}
                                    onClick={addItem}
                                    height={height}
                                />
                            </div>
                            <div className="right-section">
                                <div className="formula-section">
                                    <h4 className="sub-header">
                                        {i18n.t('Formula')}
                                    </h4>
                                    <FormulaField
                                        items={expressionArray}
                                        selectedItemId={selectedItemId}
                                        focusItemId={focusItemId}
                                        onChange={setItemValue}
                                        onClick={selectItem}
                                        onDoubleClick={removeItem}
                                        loading={!expressionArray}
                                    />
                                    <MathOperatorSelector onClick={addItem} />
                                    <div className="formula-actions">
                                        <Button
                                            small
                                            secondary
                                            onClick={() =>
                                                removeItem(selectedItemId)
                                            }
                                            dataTest="remove-button"
                                            disabled={!selectedItemId}
                                        >
                                            {i18n.t('Remove item')}
                                        </Button>
                                        <Button
                                            small
                                            secondary
                                            onClick={validate}
                                            dataTest="validate-button"
                                            loading={isValidating}
                                            disabled={isLoading}
                                        >
                                            {i18n.t('Check formula')}
                                        </Button>
                                    </div>
                                </div>
                                {validationMessage && (
                                    <div
                                        className="validation-notice"
                                        data-test="validation-message"
                                    >
                                        <NoticeBox
                                            error={
                                                expressionStatus ===
                                                INVALID_EXPRESSION
                                            }
                                            valid={
                                                expressionStatus ===
                                                VALID_EXPRESSION
                                            }
                                        >
                                            {validationMessage}
                                        </NoticeBox>
                                    </div>
                                )}
                                <div className="usage-legend">
                                    <Help>
                                        {i18n.t(
                                            'Drag or click a data element or operator to add it to the formula. Drag to reorder. Select an item and click Remove item, or double-click, to delete it.'
                                        )}
                                    </Help>
                                    <p className="see-also">
                                        <KeyboardNavigationHint />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DndContext>
                </ModalContent>
                <ModalActions dataTest="calculation-modal-actions">
                    <ButtonStrip>
                        {calculation.id && (
                            <div className="delete-button">
                                <Button
                                    secondary
                                    onClick={() => setShowDeletePrompt(true)}
                                    dataTest="delete-button"
                                    loading={isDeletingCalculation}
                                    disabled={isUpdatingCalculation}
                                >
                                    {i18n.t('Delete calculation')}
                                </Button>
                            </div>
                        )}
                        <Button
                            secondary
                            onClick={onClose}
                            disabled={isLoading}
                            dataTest="cancel-button"
                        >
                            {i18n.t('Cancel')}
                        </Button>
                        <Tooltip
                            content={
                                expressionStatus === INVALID_EXPRESSION
                                    ? i18n.t(
                                          'The calculation can only be saved with a valid formula'
                                      )
                                    : i18n.t(
                                          'Add a name to save this calculation'
                                      )
                            }
                            disabled={
                                expressionStatus === INVALID_EXPRESSION || !name
                            }
                            disabledWhenOffline={false}
                        >
                            <Button
                                primary
                                onClick={onSaveClick}
                                disabled={
                                    expressionStatus === INVALID_EXPRESSION ||
                                    !name ||
                                    isDeletingCalculation ||
                                    isValidating
                                }
                                loading={
                                    isCreatingCalculation ||
                                    isUpdatingCalculation ||
                                    isSavingCalculation
                                }
                                dataTest="save-button"
                            >
                                {i18n.t('Save calculation')}
                            </Button>
                        </Tooltip>
                    </ButtonStrip>
                </ModalActions>
            </Modal>
            {showDeletePrompt && (
                <Modal small dataTest="calculation-delete-modal">
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

                            <Button onClick={onDeleteClick} destructive>
                                {i18n.t('Yes, delete')}
                            </Button>
                        </ButtonStrip>
                    </ModalActions>
                </Modal>
            )}
            <style jsx>{styles}</style>
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
    height: PropTypes.string,
}

export default CalculationModal
