import { CssVariables } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { Component, createRef } from 'react'
import DynamicDimensionIcon from '../../../assets/DynamicDimensionIcon.js'
import {
    DIMENSION_PROP_NO_ITEMS,
    getPredefinedDimensionProp,
} from '../../../modules/predefinedDimensions.js'
import OptionsButton from './OptionsButton.js'
import RecommendedIcon from './RecommendedIcon.js'
import styles from './styles/DimensionItem.style.js'

class DimensionItem extends Component {
    state = { mouseOver: false }

    onOptionsClick = (id, ref) => (event) =>
        this.props.onOptionsClick(event, id, ref)

    onMouseOver = () => {
        this.setState({ mouseOver: true })
    }

    onMouseExit = () => {
        this.setState({ mouseOver: false })
    }

    getDimensionIcon = () => {
        const Icon = getPredefinedDimensionProp(this.props.id, 'icon')
        return Icon ? (
            <Icon className="fixedDimensionIcon" />
        ) : (
            <DynamicDimensionIcon className="dynamic-dimension-icon" />
        )
    }

    getDimensionType = () => {
        const { id, name } = this.props

        return <span data-dimensionid={id}>{name}</span>
    }

    render() {
        const {
            id,
            isDeactivated,
            isSelected,
            isRecommended,
            isLocked,
            onClick,
            onOptionsClick,
            innerRef,
            dataTest,
            className,
            ...rest
        } = this.props

        const Icon = this.getDimensionIcon()
        const Label = this.getDimensionType()

        const optionsRef = createRef()

        const LockIcon = (
            <svg
                width="7"
                height="9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.5 1A1.5 1.5 0 0 0 2 2.5V3h3v-.5A1.5 1.5 0 0 0 3.5 1ZM1 2.5V3H0v6h7V3H6v-.5a2.5 2.5 0 0 0-5 0ZM1 8V4h5v4H1Zm3-1V5H3v2h1Z"
                    fill="none"
                />
            </svg>
        )

        const onLabelClick = () => {
            if (
                !isDeactivated &&
                !getPredefinedDimensionProp(id, DIMENSION_PROP_NO_ITEMS)
            ) {
                onClick(id)
            }
        }

        return (
            <>
                <CssVariables colors />
                <li
                    onMouseOver={this.onMouseOver}
                    onMouseLeave={this.onMouseExit}
                    ref={innerRef}
                    className={cx(
                        'item',
                        {
                            deactivated: isDeactivated,
                            selected: isSelected && !isDeactivated,
                        },
                        className
                    )}
                    data-test={dataTest}
                    onClick={onLabelClick}
                    {...rest}
                >
                    <div
                        className="label"
                        tabIndex={0}
                        data-test={`${dataTest}-button-${id}`}
                    >
                        <div className="iconWrapper">{Icon}</div>
                        <div className="labelWrapper">
                            <span className="labelText">{Label}</span>
                            <RecommendedIcon
                                isRecommended={isRecommended}
                                dataTest={`${dataTest}-recommended-icon`}
                            />
                        </div>
                    </div>
                    {onOptionsClick ? (
                        <div
                            className="optionsWrapper"
                            ref={optionsRef}
                            data-test={`${dataTest}-menu-${id}`}
                        >
                            {this.state.mouseOver &&
                            !isDeactivated &&
                            !isLocked ? (
                                <OptionsButton
                                    onClick={this.onOptionsClick(
                                        id,
                                        optionsRef
                                    )}
                                />
                            ) : null}
                        </div>
                    ) : null}
                    {isLocked && <div className="lockWrapper">{LockIcon}</div>}
                </li>
                <style jsx>{styles}</style>
            </>
        )
    }
}

DimensionItem.propTypes = {
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired, // XXX
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    innerRef: PropTypes.func,
    isDeactivated: PropTypes.bool,
    isLocked: PropTypes.bool,
    isRecommended: PropTypes.bool,
    onClick: PropTypes.func,
    onOptionsClick: PropTypes.func,
}

DimensionItem.defaultProps = {
    isDeactivated: false,
    isRecommended: false,
    isSelected: false,
    isLocked: false,
    onClick: Function.prototype,
    innerRef: Function.prototype,
    style: {},
}

export default DimensionItem
