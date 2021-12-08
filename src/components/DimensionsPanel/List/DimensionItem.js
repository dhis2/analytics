import { IconLock16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component, createRef } from 'react'
import DynamicDimensionIcon from '../../../assets/DynamicDimensionIcon.js'
import { getPredefinedDimensionProp } from '../../../modules/predefinedDimensions.js'
import DimensionLabel from './DimensionLabel.js'
import OptionsButton from './OptionsButton.js'
import RecommendedIcon from './RecommendedIcon.js'
import { styles } from './styles/DimensionItem.style.js'

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
            <Icon style={styles.fixedDimensionIcon} />
        ) : (
            <DynamicDimensionIcon style={styles.dynamicDimensionIcon} />
        )
    }

    getDimensionType = () => {
        const { id, name, isDeactivated } = this.props

        return (
            <span
                data-dimensionid={id}
                style={{
                    ...styles.text,
                    ...(isDeactivated ? styles.textDeactivated : {}),
                }}
            >
                {name}
            </span>
        )
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
            style,
            dataTest,
            ...rest
        } = this.props

        const Icon = this.getDimensionIcon()
        const Label = this.getDimensionType()
        const itemStyle =
            isSelected && !isDeactivated
                ? { ...styles.item, ...styles.selected }
                : styles.item

        const optionsRef = createRef()

        return (
            <li
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseExit}
                ref={innerRef}
                style={Object.assign({}, itemStyle, style)}
                data-test={dataTest}
                {...rest}
            >
                <DimensionLabel
                    id={id}
                    isDeactivated={isDeactivated}
                    onClick={onClick}
                    dataTest={`${dataTest}-button-${id}`}
                >
                    <div style={styles.iconWrapper}>{Icon}</div>
                    <div style={styles.labelWrapper}>
                        {Label}
                        <RecommendedIcon
                            isRecommended={isRecommended}
                            dataTest={`${dataTest}-recommended-icon`}
                        />
                    </div>
                    {isLocked && (
                        <div style={styles.iconWrapper}>
                            <IconLock16 />
                        </div>
                    )}
                </DimensionLabel>
                {onOptionsClick ? (
                    <div
                        style={styles.optionsWrapper}
                        ref={optionsRef}
                        data-test={`${dataTest}-menu-${id}`}
                    >
                        {this.state.mouseOver && !isDeactivated && !isLocked ? (
                            <OptionsButton
                                style={styles.optionsButton}
                                onClick={this.onOptionsClick(id, optionsRef)}
                            />
                        ) : null}
                    </div>
                ) : null}
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
    style: PropTypes.object,
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
