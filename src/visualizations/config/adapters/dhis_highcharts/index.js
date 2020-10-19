import objectClean from 'd2-utilizr/lib/objectClean'
import isString from 'd2-utilizr/lib/isString'
import getChart from './chart'
import getXAxis from './xAxis'
import getYAxis from './yAxis'
import getSeries from './series'
import getTitle from './title'
import getSubtitle from './subtitle'
import getLegend from './legend'
import getPane from './pane'
import getNoData from './noData'
import applyLegendSet from './applyLegendSet'
import { isStacked, isDualAxisType, VIS_TYPE_COLUMN, VIS_TYPE_BAR } from '../../../../modules/visTypes'
import getSortedConfig from './getSortedConfig'
import getTrimmedConfig from './getTrimmedConfig'
import addTrendLines, { isRegressionIneligible } from './addTrendLines'
import { defaultMultiAxisTheme1 } from '../../../util/colors/themes'
import { hasCustomAxes } from '../../../../modules/axis'
import { axisHasRelativeItems } from '../../../../modules/layout/axisHasRelativeItems'
import { LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM, LEGEND_DISPLAY_STRATEGY_FIXED } from '../../../../modules/legends'

const getTransformedLayout = layout => ({
    ...layout,
    type: String(layout.type).toUpperCase(),
    rangeAxisLabel: layout.rangeAxisLabel || layout.rangeAxisTitle,
    domainAxisLabel: layout.domainAxisLabel || layout.domainAxisTitle,
    targetLineLabel: layout.targetLineLabel || layout.targetLineTitle,
    baseLineLabel: layout.baseLineLabel || layout.baseLineTitle,
})

const getTransformedExtraOptions = extraOptions => ({
    ...extraOptions,
    multiAxisTheme: extraOptions.multiAxisTheme || defaultMultiAxisTheme1,
})

export default function({ store, layout, el, extraConfig, extraOptions }) {
    const _layout = getTransformedLayout(layout)
    const _extraOptions = getTransformedExtraOptions(extraOptions)

    const stacked = isStacked(_layout.type)

    const series = store.generateData({
        type: _layout.type,
        seriesId:
            _layout.columns && _layout.columns.length
                ? _layout.columns[0].dimension
                : null,
        categoryIds:
            _layout.rows && _layout.rows.length
                ? _layout.rows.map(row => row.dimension)
                : null,
    })

    let config = {
        // type etc
        chart: getChart(_layout, el, _extraOptions.dashboard),

        // title
        title: getTitle(
            _layout,
            store.data[0].metaData,
            _extraOptions.dashboard
        ),

        // subtitle
        subtitle: getSubtitle(
            series,
            _layout,
            store.data[0].metaData,
            _extraOptions.dashboard
        ),

        // x-axis
        xAxis: getXAxis(store, _layout, _extraOptions),

        // y-axis
        yAxis: getYAxis(_layout, series, _extraOptions),

        // series
        series: getSeries(
            series.slice(),
            store,
            _layout,
            stacked,
            _extraOptions
        ),

        // legend
        legend: getLegend(_layout, _extraOptions.dashboard),

        // pane
        pane: getPane(_layout.type),

        // no data
        lang: {
            noData: _extraOptions.noData.text,
        },
        noData: getNoData(),

        // credits
        credits: {
            enabled: false,
        },

        // exporting
        exporting: {
            // disable exporting context menu
            enabled: false,
        },
    }

    // hide empty categories
    if (_layout.hideEmptyRowItems !== 'NONE') {
        config = getTrimmedConfig(config, _layout)
    }

    // sorting
    if (_layout.sortOrder) {
        config = getSortedConfig(config, _layout, stacked)
    }

    // DHIS2-9010 prevent trend lines from render when using multiple axes
    const filteredSeries = layout.series?.filter(layoutSeriesItem =>
        series.some(
            seriesItem => seriesItem.id === layoutSeriesItem.dimensionItem
        )
    )

    // DHIS2-1243 add trend lines after sorting
    // trend line on pie and gauge does not make sense
    if (
        isString(_layout.regressionType) &&
        _layout.regressionType !== 'NONE' &&
        !isRegressionIneligible(_layout.type) &&
        ((!(isDualAxisType(layout.type) && hasCustomAxes(filteredSeries)) || axisHasRelativeItems(layout.columns)))
    ) {
        config.series = addTrendLines(_layout, config.series, stacked)
    }

    // DHIS2-147 add legendset to Column and Bar
    const legendSets = extraOptions.legendSets

    if (legendSets?.length && [VIS_TYPE_COLUMN, VIS_TYPE_BAR].includes(layout.type)) {
        if (_layout.legendDisplayStrategy === LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM) {
            config.series = config.series.map(seriesObj => {
                const legendSet = legendSets.find(legendSet => legendSet.id === store.data[0].metaData.items[seriesObj.id]?.legendSet)
                return legendSet ? applyLegendSet(seriesObj, legendSet) : seriesObj
            }) 
        } else if (_layout.legendDisplayStrategy === LEGEND_DISPLAY_STRATEGY_FIXED) {
            config.series = config.series.map(seriesObj => applyLegendSet(seriesObj, legendSets[0])) 
        }
    }

    // flatten category groups
    if (config.xAxis?.length) {
        config.xAxis = config.xAxis.map(xAxis => ({
            ...xAxis,
            categories: xAxis.categories.flat(),
        }))
    }

    // force apply extra config
    Object.assign(config, extraConfig)

    return objectClean(config)
}
