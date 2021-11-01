import { useDataEngine } from '@dhis2/app-runtime'
import {
    OrganisationUnitTree,
    Checkbox,
    MultiSelect,
    MultiSelectOption,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import {
    apiFetchOrganisationUnitGroups,
    apiFetchOrganisationUnitLevels,
} from '../../api/organisationUnits'
import i18n from '../../locales/index.js'
import {
    ouIdHelper,
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
} from '../../modules/ouIdHelper'
import { DIMENSION_ID_ORGUNIT } from '../../modules/predefinedDimensions'
import styles from './styles/OrgUnitDimension.style'

const DYNAMIC_ORG_UNITS = [
    USER_ORG_UNIT,
    USER_ORG_UNIT_CHILDREN,
    USER_ORG_UNIT_GRANDCHILDREN,
]

const OrgUnitDimension = ({ root, selected, onSelect }) => {
    const [ouLevels, setOuLevels] = useState([])
    const [ouGroups, setOuGroups] = useState([])
    const dataEngine = useDataEngine()

    const onSelectItems = selectedItem => {
        const { id, checked, displayName, path } = selectedItem
        let result = [...selected]

        if (checked && DYNAMIC_ORG_UNITS.includes(id)) {
            result = [
                ...result.filter(item => DYNAMIC_ORG_UNITS.includes(item.id)),
                { id, displayName },
            ]
        } else if (checked) {
            result.push({ id, path, name: displayName })
        } else {
            result = [...result.filter(item => item.id !== id)]
        }

        return onSelect({
            dimensionId: DIMENSION_ID_ORGUNIT,
            items: result,
        })
    }

    useEffect(() => {
        const doFetchOuLevels = async () => {
            const result = await apiFetchOrganisationUnitLevels(dataEngine)
            result.sort((a, b) => (a.level > b.level ? 1 : -1))
            setOuLevels(result)
        }
        const doFetchOuGroups = async () => {
            const result = await apiFetchOrganisationUnitGroups(dataEngine)
            setOuGroups(result)
        }

        doFetchOuLevels()
        doFetchOuGroups()
    }, [dataEngine])

    const onLevelChange = ids => {
        const items = ids.map(id => ({
            id: ouIdHelper.addLevelPrefix(id),
            name: ouLevels.find(level => level.id === id).displayName,
        }))

        onSelect({
            dimensionId: DIMENSION_ID_ORGUNIT,
            items: [
                ...selected.filter(ou => !ouIdHelper.hasLevelPrefix(ou.id)),
                ...items,
            ],
        })
    }

    const onGroupChange = ids => {
        const items = ids.map(id => ({
            id: ouIdHelper.addGroupPrefix(id),
            name: ouGroups.find(group => group.id === id).displayName,
        }))

        onSelect({
            dimensionId: DIMENSION_ID_ORGUNIT,
            items: [
                ...selected.filter(ou => !ouIdHelper.hasGroupPrefix(ou.id)),
                ...items,
            ],
        })
    }

    return (
        <div className="container">
            <div className="userOrgUnitsWrapper">
                <Checkbox
                    label={i18n.t('User organisation unit')}
                    checked={selected.some(item => item.id === USER_ORG_UNIT)}
                    onChange={({ checked }) =>
                        onSelectItems({
                            id: USER_ORG_UNIT,
                            checked,
                            displayName: i18n.t('User organisation unit'),
                        })
                    }
                    dense
                />
                <Checkbox
                    label={i18n.t('User sub-units')}
                    checked={selected.some(
                        item => item.id === USER_ORG_UNIT_CHILDREN
                    )}
                    onChange={({ checked }) =>
                        onSelectItems({
                            id: USER_ORG_UNIT_CHILDREN,
                            checked,
                            displayName: i18n.t('User sub-units'),
                        })
                    }
                    dense
                />
                <Checkbox
                    label={i18n.t('User sub-x2-units')}
                    checked={selected.some(
                        item => item.id === USER_ORG_UNIT_GRANDCHILDREN
                    )}
                    onChange={({ checked }) =>
                        onSelectItems({
                            id: USER_ORG_UNIT_GRANDCHILDREN,
                            checked,
                            displayName: i18n.t('User sub-x2-units'),
                        })
                    }
                    dense
                />
            </div>
            <div
                className={cx('orgUnitTreeWrapper', {
                    disabled: selected.some(item =>
                        DYNAMIC_ORG_UNITS.includes(item.id)
                    ),
                })}
            >
                <OrganisationUnitTree
                    roots={root}
                    initiallyExpanded={[
                        root,
                        ...selected
                            .filter(
                                item =>
                                    !DYNAMIC_ORG_UNITS.includes(item.id) &&
                                    !ouIdHelper.hasLevelPrefix(item.id) &&
                                    !ouIdHelper.hasGroupPrefix(item.id)
                            )
                            .map(item => item.path),
                    ]}
                    selected={selected
                        .filter(
                            item =>
                                !DYNAMIC_ORG_UNITS.includes(item.id) &&
                                !ouIdHelper.hasLevelPrefix(item.id) &&
                                !ouIdHelper.hasGroupPrefix(item.id)
                        )
                        .map(item => item.path)}
                    onChange={onSelectItems}
                />
            </div>
            <div
                className={cx('selectsWrapper', {
                    disabled: selected.some(item =>
                        DYNAMIC_ORG_UNITS.includes(item.id)
                    ),
                })}
            >
                <MultiSelect
                    selected={
                        ouLevels.length
                            ? selected
                                  .filter(item =>
                                      ouIdHelper.hasLevelPrefix(item.id)
                                  )
                                  .map(item => ouIdHelper.removePrefix(item.id))
                            : []
                    }
                    onChange={({ selected }) => onLevelChange(selected)}
                    placeholder={i18n.t('Select a level')}
                    loading={!ouLevels.length}
                    dense
                >
                    {ouLevels.map(level => (
                        <MultiSelectOption
                            key={level.id}
                            value={level.id}
                            label={level.displayName}
                        />
                    ))}
                </MultiSelect>
                <MultiSelect
                    selected={
                        ouGroups.length
                            ? selected
                                  .filter(item =>
                                      ouIdHelper.hasGroupPrefix(item.id)
                                  )
                                  .map(item => ouIdHelper.removePrefix(item.id))
                            : []
                    }
                    onChange={({ selected }) => onGroupChange(selected)}
                    placeholder={i18n.t('Select a group')}
                    loading={!ouGroups.length}
                    dense
                >
                    {ouGroups.map(group => (
                        <MultiSelectOption
                            key={group.id}
                            value={group.id}
                            label={group.displayName}
                        />
                    ))}
                </MultiSelect>
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}
OrgUnitDimension.propTypes = {
    root: PropTypes.string,
    selected: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            path: PropTypes.string,
        })
    ),
    onSelect: PropTypes.func,
}

export default OrgUnitDimension
