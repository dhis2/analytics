import { useDataEngine } from '@dhis2/app-runtime'
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
import { apiValidateIndicatorExpression } from '../../api/expression.js'
import i18n from '../../locales/index.js'
import styles from './styles/CalculationModal.style.js'

const VALID_FORMULA = 'OK'
const INVALID_FORMULA = 'ERROR'

const CalculationModal = ({ calculation = {}, onSave, onClose }) => {
    const engine = useDataEngine()
    const [validationOutput, setValidationOutput] = useState()
    const [formula, setFormula] = useState(calculation.formula)
    const [name, setName] = useState(calculation.name)

    const getFormulaStatus = () => validationOutput?.status

    const validateExpression = async () => {
        const response = await apiValidateIndicatorExpression(engine, formula)
        setValidationOutput(response)
    }

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
                        {i18n.t('New calculation')}
                    </h4>
                    <div className="content">
                        <div className="left-section">
                            <TextAreaField
                                label={i18n.t('Formula')}
                                rows={5}
                                className="formula-input"
                                onChange={({ value }) => setFormula(value)}
                                value={formula}
                            />
                            <div className="check-button">
                                <Button
                                    small
                                    onClick={() => validateExpression()}
                                >
                                    {i18n.t('Check formula')}
                                </Button>
                                <span
                                    className={cx('validation-message', {
                                        'validation-error':
                                            getFormulaStatus() ===
                                            INVALID_FORMULA,
                                        'validation-success':
                                            getFormulaStatus() ===
                                            VALID_FORMULA,
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
                        content={i18n.t(
                            'The calculation can only be saved with a valid formula'
                        )}
                        placement="top"
                        closeDelay={200}
                    >
                        {({ ref, onMouseOver, onMouseOut }) => (
                            <span
                                ref={ref}
                                onMouseOver={
                                    getFormulaStatus() !== VALID_FORMULA &&
                                    onMouseOver
                                }
                                onMouseOut={
                                    getFormulaStatus() !== VALID_FORMULA &&
                                    onMouseOut
                                }
                                className="tooltip"
                            >
                                <p>hello</p>
                                <Button
                                    primary
                                    onClick={() =>
                                        onSave({
                                            id: calculation.id,
                                            formula,
                                            name,
                                        })
                                    }
                                    disabled={
                                        getFormulaStatus() !== VALID_FORMULA
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
    onSave: PropTypes.func.isRequired,
    calculation: PropTypes.shape({
        formula: PropTypes.string,
        id: PropTypes.string,
        name: PropTypes.string,
    }),
}

export default CalculationModal
