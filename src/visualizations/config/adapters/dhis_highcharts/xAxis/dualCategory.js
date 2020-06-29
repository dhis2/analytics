import getAxisTitle from '../getAxisTitle'
import getCategories from '../getCategories'

export default function(store, layout) {
    const axis1Categories = getCategories(
        store.data[0].metaData,
        layout.rows[1].dimension
    )

    const axis2Categories = getCategories(
        store.data[0].metaData,
        layout.rows[0].dimension
    )

    const xAxis = [
        {
            title: getAxisTitle(layout.domainAxisLabel),
            categories: Array.from(
                { length: axis2Categories.length || 1 },
                () => axis1Categories
            ),
            labels: {
                style: {
                    color: '#666',
                    textShadow: '0 0 #ccc',
                },
            },
        },
    ]

    // 2nd axis
    xAxis.push({
        categories: axis2Categories,
        labels: xAxis[0].labels,
        gridLineWidth: 1,
        opposite: 'true',
    })

    return xAxis
}
