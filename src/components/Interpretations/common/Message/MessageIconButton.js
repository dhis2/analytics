import { Tooltip, colors, spacers } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

const MessageIconButton = ({
    tooltipContent,
    disabled,
    onClick,
    selected,
    count,
    iconComponent: Icon,
}) => (
    <Tooltip closeDelay={200} content={tooltipContent}>
        {({ ref, onMouseOver, onMouseOut }) => (
            <span
                ref={ref}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                className="wrapper"
            >
                <button
                    onClick={(event) => {
                        event.stopPropagation()
                        onClick()
                    }}
                    className={cx('button', { selected })}
                    disabled={disabled}
                >
                    {count && count}
                    <Icon />
                </button>
                <style jsx>{`
                    .wrapper {
                        display: inline-flex;
                    }

                    .button {
                        all: unset;
                        cursor: pointer;
                        display: inline-flex;
                        flex-direction: row;
                        gap: ${spacers.dp4};
                        align-items: center;
                        font-size: 12px;
                        line-height: 14px;
                        color: ${colors.grey700};
                    }

                    .button.selected {
                        color: ${colors.teal600};
                        font-weight: 500;
                    }

                    .button:hover {
                        color: ${colors.grey900};
                    }

                    .button.selected:hover {
                        color: ${colors.teal800};
                    }

                    .button.selected :global(svg) {
                        color: ${colors.teal500};
                    }

                    .button.selected:hover :global(svg) {
                        color: ${colors.teal700};
                    }
                `}</style>
            </span>
        )}
    </Tooltip>
)

MessageIconButton.propTypes = {
    iconComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
        .isRequired,
    tooltipContent: PropTypes.string.isRequired,
    count: PropTypes.number,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
}

export { MessageIconButton }
