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
import { isStacked } from '../../../../modules/visTypes'
import getSortedConfig from './getSortedConfig'
import getTrimmedConfig from './getTrimmedConfig'
import addTrendLines, { isRegressionIneligible } from './addTrendLines'
import { defaultMultiAxisTheme1 } from '../../../util/colors/themes'

const getTransformedLayout = layout => ({
    ...layout,
    type: String(layout.type).toUpperCase(),
    rangeAxisLabel: layout.rangeAxisLabel || layout.rangeAxisTitle,
    domainAxisLabel: layout.domainAxisLabel || layout.domainAxisTitle,
    targetLineLabel: layout.targetLineLabel || layout.targetLineTitle,
    baseLineLabel: layout.baseLineLabel || layout.baseLineTitle,
    // DHIS2-6774: make sure optionalAxes is initialized as Array when switching
    // visualization type in dashboards app
    optionalAxes: layout.optionalAxes || [],
})

const getTransformedExtraOptions = extraOptions => ({
    ...extraOptions,
    multiAxisTheme: extraOptions.multiAxisTheme || defaultMultiAxisTheme1,
})

export default function({ store, layout, el, extraConfig, extraOptions }) {
    const _layout = getTransformedLayout(layout)
    const _extraOptions = getTransformedExtraOptions(extraOptions)

    const series = store.generateData({
        type: _layout.type,
        seriesId:
            _layout.columns && _layout.columns.length
                ? _layout.columns[0].dimension
                : null,
        categoryId:
            _layout.rows && _layout.rows.length
                ? _layout.rows[0].dimension
                : null,
    })

    const stacked = isStacked(_layout.type)

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
        config = getTrimmedConfig(config, _layout.hideEmptyRowItems)
    }

    // sorting
    if (_layout.sortOrder != 0) {
        config = getSortedConfig(config, _layout, stacked)
    }

    // DHIS2-1243 add trend lines after sorting
    // trend line on pie and gauge does not make sense
    if (
        isString(_layout.regressionType) &&
        _layout.regressionType !== 'NONE' &&
        !isRegressionIneligible(_layout.type)
    ) {
        config.series = addTrendLines(
            _layout.regressionType,
            config.series,
            stacked
        )
    }

    // force apply extra config
    Object.assign(config, extraConfig)

    return objectClean(config)
}
