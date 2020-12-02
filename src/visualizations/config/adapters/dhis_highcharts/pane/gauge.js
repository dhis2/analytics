const DEFAULT_PANE_SIZE = '100%'

export default function () {
    return {
        center: ['50%', '85%'],
        size: DEFAULT_PANE_SIZE,
        startAngle: -90,
        endAngle: 90,
        background: {
            backgroundColor: '#F1F1F1',
            innerRadius: '60%',
            outerRadius: '100%',
            shape: 'arc',
        },
    }
}
