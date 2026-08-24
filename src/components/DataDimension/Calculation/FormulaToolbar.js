import {
    Button,
    ButtonStrip,
    IconCheckmarkCircle16,
    IconErrorFilled16,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import { VALID_EXPRESSION } from '../../../modules/expressions.js'
import MathOperatorSelector from './MathOperatorSelector.js'
import styles from './styles/FormulaToolbar.style.js'

const FormulaToolbar = ({
    onAddOperator,
    onRemove,
    onValidate,
    canRemove,
    isValidating,
    isLoading,
    validationStatus,
    validationMessage,
}) => (
    <div className="formula-toolbar">
        <div className="buttons-row">
            <MathOperatorSelector onClick={onAddOperator} />
            <span className="divider" />
            <ButtonStrip>
                <Button
                    small
                    secondary
                    onClick={onRemove}
                    dataTest="remove-button"
                    disabled={!canRemove}
                >
                    {i18n.t('Remove item')}
                </Button>
                <Button
                    small
                    secondary
                    onClick={onValidate}
                    dataTest="validate-button"
                    loading={isValidating}
                    disabled={isLoading}
                >
                    {i18n.t('Check formula')}
                </Button>
            </ButtonStrip>
        </div>
        <div aria-live="polite" data-test="validation-message">
            {validationMessage && (
                <span
                    className={cx('status', {
                        valid: validationStatus === VALID_EXPRESSION,
                    })}
                >
                    {validationStatus === VALID_EXPRESSION ? (
                        <IconCheckmarkCircle16 color={colors.green700} />
                    ) : (
                        <IconErrorFilled16 color={colors.red700} />
                    )}
                    <span className="status-text">{validationMessage}</span>
                </span>
            )}
        </div>
        <style jsx>{styles}</style>
    </div>
)

FormulaToolbar.propTypes = {
    onAddOperator: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onValidate: PropTypes.func.isRequired,
    canRemove: PropTypes.bool,
    isLoading: PropTypes.bool,
    isValidating: PropTypes.bool,
    validationMessage: PropTypes.string,
    validationStatus: PropTypes.string,
}

export default FormulaToolbar
