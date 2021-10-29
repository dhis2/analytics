// import { useDataEngine } from '@dhis2/app-runtime'
import { OrganisationUnitTree, Checkbox } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../locales/index.js'
import {
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
    // const dataEngine = useDataEngine()

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

    return (
        <>
            <div style={{ display: 'flex' }}>
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
                className={cx({
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
                                item => !DYNAMIC_ORG_UNITS.includes(item.id)
                            )
                            .map(item => item.path),
                    ]}
                    selected={selected
                        .filter(item => !DYNAMIC_ORG_UNITS.includes(item.id))
                        .map(item => item.path)}
                    onChange={onSelectItems}
                />
                {
                    // TODO: Groups and levels
                }
            </div>
            <style jsx>{styles}</style>
        </>
    )
}
OrgUnitDimension.propTypes = {
    root: PropTypes.string,
    selected: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
        })
    ),
    onSelect: PropTypes.func,
}

export default OrgUnitDimension
