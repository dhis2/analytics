import { useDataMutation } from '@dhis2/app-runtime'
import {
    Button,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    InputField,
    TextAreaField,
    IconChevronRight16,
    Tooltip,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { validateExpressionMutation } from '../../api/expression.js'
import i18n from '../../locales/index.js'
import styles from './styles/CalculationModal.style.js'

const VALID_EXPRESSION = 'OK'
const INVALID_EXPRESSION = 'ERROR'

const CalculationModal = ({ calculation = {}, onSave, onClose, onDelete }) => {
    const [validateExpression] = useDataMutation(validateExpressionMutation)
    const [validationOutput, setValidationOutput] = useState()
    const [expression, setExpression] = useState(calculation.expression)
    const [name, setName] = useState(calculation.name)
    const expressionStatus = validationOutput?.status

    return (
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
                    <div className="content">
                        <div className="left-section">
                            <TextAreaField
                                label={i18n.t('Formula')}
                                rows={5}
                                onChange={({ value }) => {
                                    setValidationOutput()
                                    setExpression(value)
                                }}
                                value={expression}
                            />
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
                            <InputField
                                label={i18n.t('Name')}
                                helpText={i18n.t('Shown in column/row headers')}
                                className="name-input"
                                onChange={({ value }) => setName(value)}
                                value={name}
                            />
                            {calculation.id && (
                                <div className="delete-button">
                                    <Button
                                        small
                                        onClick={() =>
                                            onDelete({
                                                id: calculation.id,
                                            })
                                        }
                                    >
                                        {i18n.t('Delete calculation')}
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="right-section">
                            <span>{i18n.t('About calculations')}</span>
                            <ul>
                                <li>
                                    {i18n.t(
                                        'Type # in the formula input to search for data elements.'
                                    )}
                                </li>
                                <li>
                                    {i18n.t(
                                        'Operators +, -, *, / and ( ) can be used.'
                                    )}
                                </li>
                                <li>
                                    {i18n.t(
                                        'Calculations you save are only visible to you.'
                                    )}
                                </li>
                            </ul>
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
                                : i18n.t('Add a name to save this calculation')
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
                                        expressionStatus !== VALID_EXPRESSION ||
                                        !name
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
    )
}

CalculationModal.propTypes = {
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
