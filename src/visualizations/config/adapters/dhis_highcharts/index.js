import isString from 'd2-utilizr/lib/isString'
import objectClean from 'd2-utilizr/lib/objectClean'
import {
    LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM,
    LEGEND_DISPLAY_STRATEGY_FIXED,
} from '../../../../modules/legends'
import { getOutlierHelper } from '../../../../modules/outliers'
import {
    isStacked,
    isLegendSetType,
    VIS_TYPE_SCATTER,
} from '../../../../modules/visTypes'
import { defaultMultiAxisTheme1 } from '../../../util/colors/themes'
import addTrendLines, { isRegressionIneligible } from './addTrendLines'
import getChart from './chart'
import getScatterData from './getScatterData'
import getSortedConfig from './getSortedConfig'
import getTrimmedConfig from './getTrimmedConfig'
import getLegend from './legend'
import { applyLegendSet, getLegendSetTooltip } from './legendSet'
import getNoData from './noData'
import getPane from './pane'
import getPlotOptions from './plotOptions'
import getSeries from './series'
import getSubtitle from './subtitle'
import getTitle from './title'
import getXAxis from './xAxis'
import getYAxis from './yAxis'

const getTransformedLayout = layout => ({
    ...layout,
    type: String(layout.type).toUpperCase(),
    targetLineLabel: layout.targetLineLabel || layout.targetLineTitle,
    baseLineLabel: layout.baseLineLabel || layout.baseLineTitle,
})

const getTransformedExtraOptions = extraOptions => ({
    ...extraOptions,
    multiAxisTheme: extraOptions.multiAxisTheme || defaultMultiAxisTheme1,
})

export default function ({ store, layout, el, extraConfig, extraOptions }) {
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
        extraOptions: _extraOptions,
    })

    if (_layout.type === VIS_TYPE_SCATTER) {
        _extraOptions.scatterData = getScatterData(series, store)
        _extraOptions.scatterPoints = _extraOptions.scatterData.map(item => [
            item.x,
            item.y,
        ])

        if (_layout.outlierAnalysis?.enabled) {
            _extraOptions.outlierHelper = getOutlierHelper(
                _extraOptions.scatterPoints,
                _layout.outlierAnalysis
            )
        }
    }

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
        xAxis: getXAxis(store, _layout, _extraOptions, series),

        // y-axis
        yAxis: getYAxis(_layout, series, _extraOptions),

        // series
        series: getSeries(
            series.slice(),
            store.data[0].metaData,
            _layout,
            stacked,
            _extraOptions
        ),

        // legend
        legend: getLegend(
            _layout.legend?.hidden,
            _layout.legend?.label?.fontStyle,
            _layout.type,
            _extraOptions.dashboard
        ),

        // pane
        pane: getPane(_layout.type),

        // no data + zoom
        lang: {
            noData: _extraOptions.noData.text,
            resetZoom: _extraOptions.resetZoom.text,
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

    // get plot options for scatter
    if (_layout.type === VIS_TYPE_SCATTER) {
        const metaDataItems = store.data[0].metaData.items
        const columnItems = _layout.columns[0].items
        const xAxisName = metaDataItems[columnItems[1].id].name
        const yAxisName = metaDataItems[columnItems[0].id].name
        config.plotOptions = getPlotOptions({
            visType: _layout.type,
            xAxisName,
            yAxisName,
            showLabels: _layout.showValues || _layout.showData,
            tooltipData: _extraOptions.scatterData,
        })
    } else {
        config.plotOptions = getPlotOptions({
            visType: _layout.type,
            ...(_extraOptions.onToggleContextualMenu
                ? { onClick: _extraOptions.onToggleContextualMenu }
                : {}),
        })
    }

    // hide empty categories
    if (_layout.hideEmptyRowItems !== 'NONE') {
        config = getTrimmedConfig(config, _layout)
    }

    // sorting
    if (_layout.sortOrder) {
        config = getSortedConfig(config, _layout, stacked)
    }

    // DHIS2-1243 add trend lines after sorting
    // trend line on pie and gauge does not make sense
    if (
        isString(_layout.regressionType) &&
        _layout.regressionType !== 'NONE' &&
        !isRegressionIneligible(_layout.type) &&
        _layout.type !== VIS_TYPE_SCATTER
    ) {
        config.series = addTrendLines(_layout, config.series, stacked)
    }

    // DHIS2-147 add legendset to Column and Bar
    /*
     ** Note: This needs to go last, after all other data manipulation is done, as it changes
     ** the format of the data prop from an array of values to an array of objects with y and color props.
     */
    const legendSets = extraOptions.legendSets

    if (legendSets?.length && isLegendSetType(layout.type)) {
        if (
            _layout.legendDisplayStrategy ===
            LEGEND_DISPLAY_STRATEGY_BY_DATA_ITEM
        ) {
            config.series = config.series.map(seriesObj => {
                const legendSet = legendSets.find(
                    legendSet =>
                        legendSet.id ===
                        store.data[0].metaData.items[seriesObj.id]?.legendSet
                )
                return legendSet
                    ? applyLegendSet(seriesObj, legendSet)
                    : seriesObj
            })
        } else if (
            _layout.legendDisplayStrategy === LEGEND_DISPLAY_STRATEGY_FIXED
        ) {
            config.series = config.series.map(seriesObj =>
                applyLegendSet(seriesObj, legendSets[0])
            )
        }
        config.tooltip = getLegendSetTooltip()
    }

    // flatten category groups
    if (config.xAxis?.length) {
        config.xAxis = config.xAxis.map(xAxis =>
            xAxis.categories
                ? {
                      ...xAxis,
                      categories: xAxis.categories.flat(),
                  }
                : xAxis
        )
    }

    // force apply extra config
    Object.assign(config, extraConfig)

    return objectClean(config)
}
