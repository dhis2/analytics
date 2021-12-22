import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/LegendKey.style.js'

const LegendKey = ({ legendSets }) => {
    return legendSets.length ? (
        <div className="container" data-test={'legend-key-container'}>
            {legendSets.map((legendSet, index) => (
                <div
                    key={legendSet.id}
                    className={cx('legendSet', {
                        divider: index > 0,
                    })}
                    data-test={`legend-key-item-${legendSet.id}`}
                >
                    {legendSets.length > 1 && (
                        <span className="legendSetName">{legendSet.name}</span>
                    )}
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
    ) : null
}

LegendKey.propTypes = {
    legendSets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            legends: PropTypes.arrayOf(
                PropTypes.shape({
                    color: PropTypes.string.isRequired,
                    endValue: PropTypes.number.isRequired,
                    name: PropTypes.string.isRequired,
                    startValue: PropTypes.number.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
}

export default LegendKey
