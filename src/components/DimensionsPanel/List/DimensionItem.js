import React, { Component } from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import LockIcon from '@material-ui/icons/Lock'

import DimensionLabel from './DimensionLabel'
import RecommendedIcon from './RecommendedIcon'
import OptionsButton from './OptionsButton'
import DynamicDimensionIcon from '../../../assets/DynamicDimensionIcon'
import { getPredefinedDimensionProp } from '../../../modules/fixedDimensions'
import { styles } from './styles/DimensionItem.style'

export class DimensionItem extends Component {
    state = { mouseOver: false }

    onOptionsClick = id => event => this.props.onOptionsClick(event, id)

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
        const { id, name, isDeactivated, onDragStart, isLocked } = this.props

        return (
            <span
                data-dimensionid={id}
                style={{
                    ...styles.text,
                    ...(isDeactivated ? styles.textDeactivated : {}),
                }}
                draggable={!isDeactivated && !isLocked}
                onDragStart={onDragStart}
            >
                {/* is it needed here or displayName should be used instead?! */}
                {i18n.t(name)}
            </span>
        )
    }

    render() {
        const {
            id,
            isDeactivated,
            isSelected,
            isRecommended,
            onOptionsClick,
            isLocked,
        } = this.props
        const Icon = this.getDimensionIcon()
        const Label = this.getDimensionType()
        const listItemStyle =
            isSelected && !isDeactivated
                ? { ...styles.listItem, ...styles.selectedListItem }
                : styles.listItem

        return (
            <li
                style={listItemStyle}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseExit}
            >
                <DimensionLabel {...this.props}>
                    <div style={styles.iconWrapper}>{Icon}</div>
                    <div style={styles.labelWrapper}>
                        {Label}
                        <RecommendedIcon isRecommended={isRecommended} />
                    </div>
                    {isLocked && (
                        <div style={styles.iconWrapper}>
                            <LockIcon style={styles.lockIcon} />
                        </div>
                    )}
                </DimensionLabel>
                {onOptionsClick ? (
                    <div style={styles.optionsWrapper}>
                        {this.state.mouseOver && !isDeactivated && !isLocked ? (
                            <OptionsButton
                                style={styles.optionsButton}
                                onClick={this.onOptionsClick(id)}
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
    isDeactivated: PropTypes.bool,
    isLocked: PropTypes.bool,
    isRecommended: PropTypes.bool,
    onClick: PropTypes.func,
    onDragStart: PropTypes.func,
    onOptionsClick: PropTypes.func,
}

DimensionItem.defaultProps = {
    isDeactivated: false,
    isRecommended: false,
    isSelected: false,
    isLocked: false,
}

export default DimensionItem
