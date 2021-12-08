import { useDataEngine } from '@dhis2/app-runtime'
import { Radio, Field } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { apiFetchItemsByDimension } from '../../api/dimensions'
import i18n from '../../locales/index.js'
import ItemSelector from './ItemSelector'
import styles from './styles/DynamicDimension.style'

export const ALL_DYNAMIC_DIMENSION_ITEMS = 'ALL_ITEMS'

export const DynamicDimension = ({
    dimensionId,
    onSelect,
    selectedItems,
    rightFooter,
    dimensionTitle,
    displayNameProp,
}) => {
    const dataEngine = useDataEngine()

    const fetchItems = (page, searchTerm) =>
        apiFetchItemsByDimension({
            dataEngine,
            dimensionId,
            searchTerm,
            page,
            nameProp: displayNameProp,
        })

    const onSelectItems = (newSelectedItems) =>
        onSelect({
            dimensionId,
            items: newSelectedItems.map((item) => ({
                id: item.value,
                name: item.label,
            })),
        })

    const allIsSelected = selectedItems.some(
        (item) => item.id === ALL_DYNAMIC_DIMENSION_ITEMS
    )

    const selectAutomatic = () =>
        onSelect({
            dimensionId,
            items: [
                {
                    id: ALL_DYNAMIC_DIMENSION_ITEMS,
                    name: i18n.t('All items'),
                },
                ...selectedItems,
            ],
        })

    const selectManual = () =>
        onSelect({
            dimensionId,
            items: [
                ...selectedItems.filter(
                    (item) => item.id !== ALL_DYNAMIC_DIMENSION_ITEMS
                ),
            ],
        })

    return (
        <>
            <Field name="dynamic-dimension-selection-type-selector" dense>
                <div className="automatic">
                    <Radio
                        key={'AUTOMATIC'}
                        label={i18n.t('Automatically include all items')}
                        dense
                        onChange={() => selectAutomatic()}
                        checked={allIsSelected}
                        dataTest={'dynamic-dimension-selection-type-automatic'}
                    />
                    <p className="help-text">
                        {i18n.t(
                            'Select all {{- dimensionTitle}} items. With this option, new items added in the future will be automatically included.',
                            {
                                dimensionTitle,
                            }
                        )}
                    </p>
                </div>
                <div className="manual">
                    <Radio
                        key={'MANUAL'}
                        label={i18n.t('Manually select items...')}
                        dense
                        onChange={() => selectManual()}
                        checked={!allIsSelected}
                        dataTest={'dynamic-dimension-selection-type-manual'}
                    />
                </div>
            </Field>
            {!allIsSelected && (
                <ItemSelector
                    initialSelected={selectedItems.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }))}
                    noItemsMessage={i18n.t(
                        'Nothing found in {{- dimensionTitle}}',
                        {
                            dimensionTitle,
                        }
                    )}
                    onFetch={fetchItems}
                    onSelect={onSelectItems}
                    rightFooter={rightFooter}
                    dataTest={`${dimensionTitle
                        .replace(/\s+/g, '-')
                        .toLowerCase()}-dimension`}
                />
            )}
            <style jsx>{styles}</style>
        </>
    )
}

DynamicDimension.propTypes = {
    dimensionId: PropTypes.string.isRequired,
    dimensionTitle: PropTypes.string.isRequired,
    displayNameProp: PropTypes.string.isRequired,
    selectedItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    rightFooter: PropTypes.node,
}

DynamicDimension.defaultProps = {
    selectedItems: [],
    onSelect: Function.prototype,
}

export default DynamicDimension
