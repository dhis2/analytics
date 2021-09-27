import { FieldSet, Legend, TabBar, Tab, Help } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
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

export class VisualizationOptions extends Component {
    state = { activeTabKey: undefined }

    selectTab = tabKey => {
        this.setState({ activeTabKey: tabKey })
    }

    generateTabContent = sections =>
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

    generateTabs = tabs =>
        tabs.map(({ key, label, content }) => ({
            key,
            label,
            content: this.generateTabContent(content),
        }))

    render() {
        const tabs = this.generateTabs(this.props.optionsConfig)

        let activeTabIndex = tabs.findIndex(
            tab => tab.key === this.state.activeTabKey
        )

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
                                onClick={() => this.selectTab(key)}
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
}

VisualizationOptions.propTypes = {
    optionsConfig: PropTypes.array.isRequired,
}

export default VisualizationOptions
