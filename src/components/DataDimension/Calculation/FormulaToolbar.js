import { Button, ButtonStrip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../locales/index.js'
import MathOperatorSelector from './MathOperatorSelector.js'
import styles from './styles/FormulaToolbar.style.js'

const FormulaToolbar = ({
    onAddOperator,
    onRemove,
    onValidate,
    canRemove,
    isValidating,
    isLoading,
}) => (
    <div className="formula-toolbar">
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
}

export default FormulaToolbar
