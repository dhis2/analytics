import { useOnlineStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Tooltip } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { styles } from './styles/OfflineTooltip.style.js'

const OfflineTooltip = ({
    disabledWhenOffline,
    disabled,
    content,
    children,
}) => {
    const { offline } = useOnlineStatus()

    const notAllowed = disabled || (disabledWhenOffline && offline)

    return (
        <>
            <Tooltip
                content={content || i18n.t('Not available offline')}
                openDelay={200}
                closeDelay={100}
            >
                {({ onMouseOver, onMouseOut, ref }) => (
                    <span
                        className={cx('tooltip', notAllowed && 'notAllowed')}
                        onMouseOver={() => notAllowed && onMouseOver()}
                        onMouseOut={() => notAllowed && onMouseOut()}
                        ref={ref}
                    >
                        {children}
                    </span>
                )}
            </Tooltip>
            <style jsx>{styles}</style>
        </>
    )
}

OfflineTooltip.propTypes = {
    children: PropTypes.node,
    content: PropTypes.string,
    disabled: PropTypes.bool,
    disabledWhenOffline: PropTypes.bool,
}

OfflineTooltip.defaultProps = {
    disabled: false,
    disabledWhenOffline: true,
}

export { OfflineTooltip }
