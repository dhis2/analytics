import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    InputField,
    IconChevronRight16,
    Tooltip,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { validateExpressionMutation } from '../../api/expression.js'
import i18n from '../../locales/index.js'
import DataElementSelector from './DataElementSelector.js'
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
    const [validateExpression] = useDataMutation(validateExpressionMutation, {
        onError: (error) => showError(error),
    })
    const [validationOutput, setValidationOutput] = useState()
    const [expression, setExpression] = useState(calculation.expression)
    const [name, setName] = useState(calculation.name)
    const [showDeletePrompt, setShowDeletePrompt] = useState()
    const expressionStatus = validationOutput?.status

    return (
        <>
            <Modal dataTest={`calculation-modal`} position="top" large>
                <ModalTitle dataTest={'calculation-modal-title'}>
                    {i18n.t('Data')}
                </ModalTitle>
                <ModalContent dataTest={'calculation-modal-content'}>
                    <>
                        <h4 className="header">
                            {i18n.t('Data')}
                            <span className="header-icon">
                                <IconChevronRight16 />
                            </span>
                            {calculation.id
                                ? i18n.t('Edit calculation')
                                : i18n.t('New calculation')}
                        </h4>
                        <InputField
                            label={i18n.t('Name')}
                            helpText={i18n.t('Shown in column/row headers')}
                            className="name-input"
                            onChange={({ value }) => setName(value)}
                            value={name}
                        />
                        <div className="content">
                            <div className="left-section">
                                <DataElementSelector
                                    displayNameProp={displayNameProp}
                                />
                            </div>
                            <div className="right-section">
                                <div className="check-button">
                                    <Button
                                        small
                                        onClick={async () =>
                                            setValidationOutput(
                                                await validateExpression({
                                                    expression,
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
                                                expression,
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
