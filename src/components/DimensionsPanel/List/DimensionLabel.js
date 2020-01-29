import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { styles } from './styles/DimensionLabel.style'
import {
    getPredefinedDimensionProp,
    DIMENSION_PROP_NO_ITEMS,
} from '../../../modules/predefinedDimensions'

export class DimensionLabel extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        isDeactivated: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        children: PropTypes.array,
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
                data-test={`dimension-id-${this.props.id}`}
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
