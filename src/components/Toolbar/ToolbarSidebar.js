import { colors } from '@dhis2/ui-constants'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

export const ToolbarSidebar = ({ children, isHidden }) => (
    <div className={cx('container', { isHidden })}>
        {children}
        <style jsx>{`
            div {
                width: 260px;
                display: flex;
                align-items: stretch;
                border-right: 1px solid ${colors.grey400};
            }
            div.isHidden {
                display: none;
            }
        `}</style>
    </div>
)

ToolbarSidebar.propTypes = {
    children: PropTypes.node,
    isHidden: PropTypes.bool,
}
