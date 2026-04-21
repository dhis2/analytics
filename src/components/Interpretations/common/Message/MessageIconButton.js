import { Tooltip, colors, theme } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { CONFIRM_TIMEOUT_MS } from '../useConfirmClick.js'

const ProgressIcon = ({
    duration = CONFIRM_TIMEOUT_MS,
    size = 16,
    strokeWidth = 3,
}) => {
    const r = (size - strokeWidth) / 2
    const center = size / 2

    return (
        <>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <circle
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke={colors.red100}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="progress"
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke={colors.red800}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    pathLength="100"
                    strokeDasharray="100"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </svg>

            <style jsx>{`
                .progress {
                    animation: fill-ring ${duration}ms ease-in-out forwards;
                }
                @keyframes fill-ring {
                    from {
                        stroke-dashoffset: 100;
                    }
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
        </>
    )
}

ProgressIcon.propTypes = {
    duration: PropTypes.number,
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
}

const MessageIconButton = ({
    tooltipContent,
    disabled,
    onClick,
    selected,
    confirming,
    label,
    iconComponent: Icon,
    dataTest,
    viewOnly,
}) => (
    <button
        onClick={(event) => {
            event.stopPropagation()
            onClick()
        }}
        className={cx('button', {
            selected,
            viewOnly,
            confirming,
        })}
        disabled={disabled}
        data-test={dataTest}
    >
        <Tooltip closeDelay={200} content={tooltipContent}>
            {({ ref, onMouseOver, onMouseOut }) => (
                <span
                    ref={ref}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    className="wrapper"
                >
                    {confirming ? <ProgressIcon /> : <Icon />}
                </span>
            )}
        </Tooltip>

        {label !== undefined && label !== null && (
            <span className="label">{label}</span>
        )}
        <style jsx>{`
            .wrapper {
                display: inline-flex;
            }

            .button {
                all: unset;
                cursor: pointer;
                display: inline-flex;
                flex-direction: row;
                gap: 3px;
                align-items: center;

                font-size: 13px;
                line-height: 1;
                color: ${colors.grey700};
                border: 1px solid transparent;
                border-radius: 5px;
                padding: 3px 5px;
            }

            .viewOnly {
                cursor: default;
            }

            .button.selected {
                color: ${colors.teal600};
                font-weight: 400;
                background-color: ${colors.teal050};
            }

            .button:hover {
                color: ${colors.grey900};
                background-color: ${colors.grey200};
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

            .button.confirming {
                color: ${colors.red700};
                background-color: ${colors.red100};
            }

            .button.confirming :global(svg) {
                color: ${colors.red700};
            }

            .button.confirming:hover {
                color: ${colors.red800};
                background-color: ${colors.red200};
            }

            .button.confirming:hover :global(svg) {
                color: ${colors.red800};
            }

            .button:disabled {
                color: ${theme.disabled};
                cursor: not-allowed;
            }

            .button:disabled :global(svg) {
                color: ${theme.disabled};
            }

            .button:focus-visible {
                outline: 2px solid ${theme.focus};
                outline-offset: -2px;
            }
        `}</style>
    </button>
)

MessageIconButton.propTypes = {
    iconComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
        .isRequired,
    tooltipContent: PropTypes.string.isRequired,
    confirming: PropTypes.bool,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    selected: PropTypes.bool,
    viewOnly: PropTypes.bool,
    onClick: PropTypes.func,
}

export { MessageIconButton }
