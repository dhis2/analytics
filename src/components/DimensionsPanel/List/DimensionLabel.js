import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
    getPredefinedDimensionProp,
    DIMENSION_PROP_NO_ITEMS,
} from '../../../modules/predefinedDimensions'
import { styles } from './styles/DimensionLabel.style'

export class DimensionLabel extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        isDeactivated: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        children: PropTypes.array,
        dataTest: PropTypes.string,
    }

    onLabelClick = () => {
        if (
            !this.props.isDeactivated &&
            !getPredefinedDimensionProp(this.props.id, DIMENSION_PROP_NO_ITEMS)
        ) {
            this.props.onClick(this.props.id)
        }
    }

    onKeyPress = event => {
        if (event.key === 'Enter' && event.ctrlKey === false) {
            this.onLabelClick()
        }
    }

    render() {
        return (
            <div
                data-test={this.props.dataTest}
                className="label"
                onClick={this.onLabelClick}
                onKeyPress={this.onKeyPress}
                tabIndex={0}
                style={styles.label}
            >
                {this.props.children}
            </div>
        )
    }
}

export default DimensionLabel
