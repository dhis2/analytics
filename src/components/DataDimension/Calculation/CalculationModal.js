import { useAlert, useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    InputField,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    createCalculationMutation,
    deleteCalculationMutation,
    updateCalculationMutation,
    validateExpressionMutation,
} from '../../../api/expression.js'
import i18n from '../../../locales/index.js'
import {
    parseExpressionToArray,
    parseArrayToExpression,
    validateExpression,
    EXPRESSION_TYPE_DATA,
    EXPRESSION_TYPE_NUMBER,
    INVALID_EXPRESSION,
    VALID_EXPRESSION,
    getItemIdsFromExpression,
} from '../../../modules/expressions.js'
import { OfflineTooltip as Tooltip } from '../../OfflineTooltip.js'
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
    calculation,
    onSave,
    onClose,
    onDelete,
    displayNameProp,
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
        validateExpressionMutation,
        {
            onError: (error) => showError(error),
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

    const [newIdCount, setNewIdCount] = useState(1)

    const [validationOutput, setValidationOutput] = useState(null)
    const [expressionArray, setExpressionArray] = useState()
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
            value: type === EXPRESSION_TYPE_DATA ? `#{${value}}` : value,
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

        if (newItem.type === EXPRESSION_TYPE_NUMBER) {
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
        setValidationOutput()
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

    const onSaveClick = async () => {
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
        })
    }

    const onDeleteClick = async () => {
        setShowDeletePrompt()
        await deleteCalculation(calculation.id)
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
                    <DndContext
                        onDragStart={() => setFocusItemId(null)}
                        onDragEnd={addOrMoveDraggedItem}
                    >
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
                                    loading={!expressionArray}
                                />
                                <div className="actions-wrapper">
                                    <div className="validate-button">
                                        <Button
                                            small
                                            onClick={validate}
                                            dataTest="validate-button"
                                            loading={isValidating}
                                        >
                                            {i18n.t('Check formula')}
                                        </Button>
                                    </div>
                                    {selectedItemId !== null && (
                                        <div className="remove-button">
                                            <Button
                                                small
                                                onClick={() =>
                                                    removeItem(selectedItemId)
                                                }
                                                dataTest="remove-button"
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
                                        data-test="validation-message"
                                    >
                                        {validationOutput?.message}
                                    </span>
                                    {calculation.id && (
                                        <div className="delete-button">
                                            <Button
                                                small
                                                onClick={() =>
                                                    setShowDeletePrompt(true)
                                                }
                                                dataTest="delete-button"
                                                loading={isDeletingCalculation}
                                                disabled={isUpdatingCalculation}
                                            >
                                                {i18n.t('Delete calculation')}
                                            </Button>
                                        </div>
                                    )}
                                    <div className="name-input">
                                        <InputField
                                            label={i18n.t(
                                                'Label shown in column/row headers'
                                            )}
                                            onChange={({ value }) =>
                                                setName(value.substr(0, 50))
                                            }
                                            value={name}
                                            dataTest="calculation-label"
                                            dense
                                        />
                                    </div>
                                    <p style={{ color: 'blue' }}>
                                        {/* TODO: Remove, for testing only */}
                                        OUTPUT:{' '}
                                        {parseArrayToExpression(
                                            expressionArray
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <style jsx>{styles}</style>
                    </DndContext>
                </ModalContent>
                <ModalActions dataTest="calculation-modal-actions">
                    <ButtonStrip>
                        <Button
                            onClick={onClose}
                            disabled={
                                isCreatingCalculation ||
                                isUpdatingCalculation ||
                                isDeletingCalculation
                            }
                            dataTest="cancel-button"
                        >
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
                            disabled={
                                expressionStatus !== VALID_EXPRESSION || !name
                            }
                            disabledWhenOffline={false}
                        >
                            <Button
                                primary
                                onClick={onSaveClick}
                                disabled={
                                    expressionStatus !== VALID_EXPRESSION ||
                                    !name ||
                                    isDeletingCalculation
                                }
                                loading={
                                    isCreatingCalculation ||
                                    isUpdatingCalculation
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

                            <Button onClick={onDeleteClick} destructive>
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

CalculationModal.defaultProps = {
    calculation: {},
}

export default CalculationModal
