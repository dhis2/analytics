import i18n from '@dhis2/d2-i18n'
import {
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    FieldSet,
    Legend,
    TabBar,
    Tab,
    Help,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import {
    modalContent,
    tabSection,
    tabSectionTitle,
    tabSectionTitleMargin,
    tabSectionOption,
    tabSectionOptionItem,
    tabSectionOptionToggleable,
    tabSectionToggleableSubsection,
    tabSectionOptionComplexInline,
    tabSectionOptionText,
    tabBar,
    tabContent,
    tabSectionOptionIcon,
} from './styles/VisualizationOptions.style.js'

const VisualizationOptions = ({ optionsConfig, onClose, onUpdate }) => {
    const [activeTabKey, setActiveTabKey] = useState()

    const generateTabContent = sections =>
        sections.map(({ key, label, content, helpText }) => (
            <div key={key} className={tabSection.className}>
                <FieldSet>
                    {label ? (
                        <Legend>
                            <span className={tabSectionTitle.className}>
                                {label}
                            </span>
                        </Legend>
                    ) : null}
                    {content}
                    {helpText ? (
                        <Legend>
                            <Help>{helpText}</Help>
                        </Legend>
                    ) : null}
                </FieldSet>
            </div>
        ))

    const generateTabs = tabs =>
        tabs.map(({ key, label, content }) => ({
            key,
            label,
            content: generateTabContent(content),
        }))

    const getModalContent = () => {
        const tabs = generateTabs(optionsConfig)

        let activeTabIndex = tabs.findIndex(tab => tab.key === activeTabKey)

        if (activeTabIndex < 0) {
            activeTabIndex = 0
        }
        return (
            <>
                <div className={tabBar.className}>
                    <TabBar dataTest={'options-modal-tab-bar'}>
                        {tabs.map(({ key, label }, index) => (
                            <Tab
                                key={key}
                                onClick={() => setActiveTabKey(key)}
                                selected={index === activeTabIndex}
                            >
                                {label}
                            </Tab>
                        ))}
                    </TabBar>
                    {tabBar.styles}
                </div>
                <div className={tabContent.className}>
                    {tabs[activeTabIndex].content}
                    {tabContent.styles}
                    {tabSection.styles}
                    {tabSectionTitle.styles}
                    {tabSectionTitleMargin.styles}
                    {tabSectionOption.styles}
                    {tabSectionOptionItem.styles}
                    {tabSectionOptionToggleable.styles}
                    {tabSectionToggleableSubsection.styles}
                    {tabSectionOptionComplexInline.styles}
                    {tabSectionOptionText.styles}
                    {tabSectionOptionIcon.styles}
                </div>
            </>
        )
    }

    return (
        <Modal
            onClose={onClose}
            position="top"
            large
            dataTest={'options-modal'}
        >
            <ModalTitle>{i18n.t('Options')}</ModalTitle>
            <ModalContent
                className={modalContent.className}
                dataTest={'options-modal-content'}
            >
                {getModalContent()}
            </ModalContent>
            <ModalActions dataTest={'options-modal-actions'}>
                <ButtonStrip>
                    <Button
                        type="button"
                        secondary
                        onClick={onClose}
                        dataTest={'options-modal-action-cancel'}
                    >
                        {i18n.t('Hide')}
                    </Button>
                    <Button
                        onClick={onUpdate}
                        dataTest={'options-modal-action-confirm'}
                        type="button"
                        primary
                    >
                        {i18n.t('Update')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
            {modalContent.styles}
        </Modal>
    )
}

VisualizationOptions.propTypes = {
    optionsConfig: PropTypes.array.isRequired,
    onClose: PropTypes.func,
    onUpdate: PropTypes.func,
}

export default VisualizationOptions
