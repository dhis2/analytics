import { Button, InputField, TextAreaField } from '@dhis2/ui'
import React from 'react'
import i18n from '../../locales/index.js'

const EditCalculation = () => {
    return (
        <>
            <h4>{i18n.t('Data > New calculation')}</h4>
            <div>
                <TextAreaField label={i18n.t('Formula')} rows={5} />
                <Button>{i18n.t('Check formula')}</Button>
                <InputField
                    label={i18n.t('Name')}
                    helpText={i18n.t('Shown in column/row headers')}
                />
            </div>
        </>
    )
}

EditCalculation.propTypes = {}

EditCalculation.defaultProps = {}

export default EditCalculation
