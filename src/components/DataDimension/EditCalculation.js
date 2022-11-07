import {
    Button,
    InputField,
    TextAreaField,
    IconChevronRight16,
} from '@dhis2/ui'
import React from 'react'
import i18n from '../../locales/index.js'
import styles from './styles/EditCalculation.style.js'

const EditCalculation = () => {
    return (
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
                    />
                    <div className="check-button">
                        <Button small>{i18n.t('Check formula')}</Button>
                    </div>
                    <InputField
                        label={i18n.t('Name')}
                        helpText={i18n.t('Shown in column/row headers')}
                        className="name-input"
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
    )
}

EditCalculation.propTypes = {}

EditCalculation.defaultProps = {}

export default EditCalculation
