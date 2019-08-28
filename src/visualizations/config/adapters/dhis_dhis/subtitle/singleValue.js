import getFilterText from '../../dhis_highcharts/getFilterText'

export default function(layout, metaData) {
    return layout.filters ? getFilterText(layout.filters, metaData) : ''
}
