import { IconLock16 } from '@dhis2/ui'
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
            <Icon className="fixed-dimension-icon" />
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
            ...rest
        } = this.props

        const Icon = this.getDimensionIcon()
        const Label = this.getDimensionType()

        const optionsRef = createRef()

        const onLabelClick = () => {
            if (
                !isDeactivated &&
                !getPredefinedDimensionProp(id, DIMENSION_PROP_NO_ITEMS)
            ) {
                onClick(id)
            }
        }

        return (
            <li
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseExit}
                ref={innerRef}
                className={`
                item 
                ${!isDeactivated ? `clickable` : `deactivated`}
                ${isSelected && !isDeactivated ? `selected` : ``}
                `}
                data-test={dataTest}
                onClick={onLabelClick}
                {...rest}
            >
                <div
                    className={`
                    label
                    ${isDeactivated ? `label-deactivated` : ``}
                    `}
                    tabIndex={0}
                    data-test={`${dataTest}-button-${id}`}
                >
                    <div className="icon-wrapper">{Icon}</div>
                    <div className="label-wrapper">
                        {Label}
                        <RecommendedIcon
                            isRecommended={isRecommended}
                            dataTest={`${dataTest}-recommended-icon`}
                        />
                    </div>
                    {isLocked && (
                        <div className="lock-wrapper">
                            <IconLock16 />
                        </div>
                    )}
                </div>
                {onOptionsClick ? (
                    <div
                        className="options-wrapper"
                        ref={optionsRef}
                        data-test={`${dataTest}-menu-${id}`}
                    >
                        {this.state.mouseOver && !isDeactivated && !isLocked ? (
                            <OptionsButton
                                onClick={this.onOptionsClick(id, optionsRef)}
                            />
                        ) : null}
                    </div>
                ) : null}
                <style jsx>{styles}</style>
            </li>
        )
    }
}

DimensionItem.propTypes = {
    id: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired, // XXX
    name: PropTypes.string.isRequired,
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
