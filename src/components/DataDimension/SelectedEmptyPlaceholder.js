import i18n from '@dhis2/d2-i18n'
import React from 'react'
import styles from './styles/EmptyPlaceholder.style.js'

export const SelectedEmptyPlaceholder = () => (
    <>
        <p className="empty-list">{i18n.t('No items selected')}</p>
        <style jsx>{styles}</style>
    </>
)
