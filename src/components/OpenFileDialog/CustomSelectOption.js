import i18n from '@dhis2/d2-i18n'
import { MenuDivider, Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/CustomSelectOption.style.js'

const CustomSelectOptionItem = ({
    value,
    label,
    icon,
    insertDivider,
    onClick,
    active,
    disabled,
}) => (
    <>
        <div
            onClick={(e) => onClick({}, e)}
            data-value={value}
            data-label={label}
            className={cx({ active, disabled })}
        >
            {icon}
            <span className={cx({ label: icon })}>{label}</span>
            <style jsx>{styles}</style>
        </div>
        {insertDivider && <MenuDivider dense />}
    </>
)

export const CustomSelectOption = (props) =>
    props.disabled ? (
        <Tooltip content={i18n.t('Not supported by this app yet')}>
            <CustomSelectOptionItem {...props} />
        </Tooltip>
    ) : (
        <CustomSelectOptionItem {...props} />
    )

CustomSelectOption.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    icon: PropTypes.element,
    onClick: PropTypes.func,
}

CustomSelectOptionItem.propTypes = CustomSelectOption.propTypes

export default CustomSelectOption
