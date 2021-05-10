import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { colors, spacers } from '@dhis2/ui'

export const CustomSelectOption = ({
    value,
    label,
    icon,
    onClick,
    active,
    disabled,
}) => (
    <div
        onClick={e => onClick({}, e)}
        data-value={value}
        data-label={label}
        className={cx({ active, disabled })}
    >
        {icon}
        <span className="label">{label}</span>
        <style jsx>{`
            div {
                display: flex;
                align-items: center;
                cursor: pointer;
                font-size: 14px;
                text-decoration: none;
                color: ${colors.grey900};
                padding: ${spacers.dp8} ${spacers.dp12};
            }

            div:hover {
                background-color: ${colors.grey200};
            }

            div:active,
            div.active {
                background-color: ${colors.teal700};
                color: ${colors.white};
                cursor: auto;
            }

            div.disabled {
                color: ${colors.grey500};
                cursor: not-allowed;
                user-select: none;
            }

            div.disabled:hover {
                background-color: initial;
            }

            span.label {
                margin-left: ${spacers.dp8};
            }
        `}</style>
    </div>
)

CustomSelectOption.propTypes = {
    icon: PropTypes.element.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
}

export default CustomSelectOption
