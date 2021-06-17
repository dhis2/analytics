import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/LegendKey.style'

const LegendKey = ({ legendSets }) => {
    return (
        <div className="container">
            {legendSets.map(legendSet => (
                <div key={legendSet.id} className="legendSet">
                    {legendSet.legends
                        .sort((a, b) => a.startValue - b.startValue)
                        .map(legend => (
                            <div
                                key={legend.startValue}
                                className="legend"
                                style={{
                                    borderLeft: `6px ${legend.color} solid`,
                                }}
                            >
                                <span>{legend.name}</span>
                                <span className="values">{`${legend.startValue}-<${legend.endValue}`}</span>
                            </div>
                        ))}
                </div>
            ))}
            <style jsx>{styles}</style>
        </div>
    )
}

LegendKey.propTypes = {
    legendSets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            legends: PropTypes.arrayOf(
                PropTypes.shape({
                    color: PropTypes.string.isRequired,
                    endValue: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                    startValue: PropTypes.string.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
}

export default LegendKey
