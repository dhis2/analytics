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
} from '../../modules/expressions.js'
import DataElementSelector from './DataElementSelector.js'
import FormulaField from './FormulaField.js'
import MathOperatorSelector from './MathOperatorSelector.js'
import styles from './styles/CalculationModal.style.js'

const VALID_EXPRESSION = 'OK'
const INVALID_EXPRESSION = 'ERROR'

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

        if (/[-+/*]{2,}/.test(expression)) {
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
                    <>
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
                                        setExpressionArray((prevArray) =>
                                            prevArray.concat([
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
                                        setExpressionArray((prevArray) =>
                                            prevArray.concat([
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
                                    expression={expressionArray}
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
                    </>
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
