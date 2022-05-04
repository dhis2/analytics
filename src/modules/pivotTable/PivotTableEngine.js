import times from 'lodash/times'
import { DIMENSION_ID_ORGUNIT } from '../predefinedDimensions.js'
import { renderValue } from '../renderValue.js'
import { VALUE_TYPE_NUMBER, VALUE_TYPE_TEXT } from '../valueTypes.js'
import { AdaptiveClippingController } from './AdaptiveClippingController.js'
import { parseValue } from './parseValue.js'
import {
    AGGREGATE_TYPE_NA,
    AGGREGATE_TYPE_AVERAGE,
    AGGREGATE_TYPE_SUM,
    CELL_TYPE_VALUE,
    CELL_TYPE_TOTAL,
    CELL_TYPE_SUBTOTAL,
    SORT_ORDER_ASCENDING,
    SORT_ORDER_DESCENDING,
    DISPLAY_DENSITY_PADDING_COMPACT,
    DISPLAY_DENSITY_PADDING_COMFORTABLE,
    DISPLAY_DENSITY_OPTION_COMFORTABLE,
    DISPLAY_DENSITY_OPTION_COMPACT,
    DISPLAY_DENSITY_OPTION_NORMAL,
    DISPLAY_DENSITY_PADDING_NORMAL,
    FONT_SIZE_OPTION_SMALL,
    FONT_SIZE_SMALL,
    FONT_SIZE_OPTION_LARGE,
    FONT_SIZE_LARGE,
    FONT_SIZE_OPTION_NORMAL,
    FONT_SIZE_NORMAL,
    NUMBER_TYPE_COLUMN_PERCENTAGE,
    NUMBER_TYPE_ROW_PERCENTAGE,
    DIMENSION_TYPE_DATA,
    DIMENSION_TYPE_DATA_ELEMENT_GROUP_SET,
    DIMENSION_TYPE_ORGUNIT,
    DIMENSION_TYPE_PERIOD,
    NUMBER_TYPE_VALUE,
} from './pivotTableConstants.js'

const dataFields = [
    'value',
    'numerator',
    'denominator',
    'factor',
    'multiplier',
    'divisor',
]
const defaultOptions = {
    hideEmptyColumns: false,
    hideEmptyRows: false,
    showRowTotals: false,
    showColumnTotals: false,
    showRowSubtotals: false,
    showColumnSubtotals: false,
    fixColumnHeaders: false,
    fixRowHeaders: false,
}

const defaultVisualizationProps = {
    fontSize: FONT_SIZE_OPTION_NORMAL,
    displayDensity: DISPLAY_DENSITY_OPTION_NORMAL,
}

const isDxDimension = (dimensionItem) =>
    [DIMENSION_TYPE_DATA, DIMENSION_TYPE_DATA_ELEMENT_GROUP_SET].includes(
        dimensionItem.dimensionType
    )

const countFromDisaggregates = (list) => {
    let count = 1
    list.forEach((x) => {
        count *= x.items.length
    })
    return count
}

const addSize = (list) => {
    const reversedList = list.slice().reverse()
    reversedList.forEach((level, idx) => {
        // Start at the "leaf" disaggregate
        const lastLevel = reversedList[idx - 1]
        level.size = lastLevel ? lastLevel.count * lastLevel.size : 1
    })
}

const listByDimension = (list) =>
    list.reduce((all, item) => {
        all[item.dimension] = item
        return all
    }, {})

const sortByHierarchy = (items) => {
    items.sort((a, b) => {
        if (!a.hierarchy || !b.hierarchy) {
            return 0
        }
        return a.hierarchy.join('/').localeCompare(b.hierarchy.join('/'))
    })
}

const buildDimensionLookup = (visualization, metadata, headers) => {
    const rows = visualization.rows.map((row) => ({
        dimension: row.dimension,
        meta: metadata.items[row.dimension],
        count: metadata.dimensions[row.dimension].length,
        itemIds: metadata.dimensions[row.dimension],
        items: metadata.dimensions[row.dimension].map(
            (item) => metadata.items[item]
        ),
        isDxDimension: isDxDimension(metadata.items[row.dimension]),
        position: 'row',
    }))
    const columns = visualization.columns.map((column) => ({
        dimension: column.dimension,
        meta: metadata.items[column.dimension],
        count: metadata.dimensions[column.dimension].length,
        itemIds: metadata.dimensions[column.dimension],
        items: metadata.dimensions[column.dimension].map(
            (item) => metadata.items[item]
        ),
        isDxDimension: isDxDimension(metadata.items[column.dimension]),
        position: 'column',
    }))

    addSize(rows)
    addSize(columns)

    const allByDimension = {
        ...listByDimension(rows),
        ...listByDimension(columns),
    }

    const headerDimensions = headers.map(
        (header) => allByDimension[header.name]
    )

    const rowHeaders = headerDimensions
        .map((_, idx) => idx)
        .filter(
            (idx) =>
                headerDimensions[idx] &&
                headerDimensions[idx].position === 'row'
        )
    const columnHeaders = headerDimensions
        .map((_, idx) => idx)
        .filter(
            (idx) =>
                headerDimensions[idx] &&
                headerDimensions[idx].position === 'column'
        )

    const dataHeaders = dataFields.reduce((out, field) => {
        out[field] = headers.findIndex((header) => header.name === field)
        return out
    }, {})

    const ouDimension = allByDimension[DIMENSION_ID_ORGUNIT]

    if (
        visualization.showHierarchy &&
        metadata.ouNameHierarchy &&
        ouDimension
    ) {
        ouDimension.items.forEach((ou) => {
            const hierarchy = metadata.ouNameHierarchy[ou.uid]
            if (hierarchy) {
                ou.hierarchy = hierarchy.split('/').filter((x) => x.length)
            }
        })
        sortByHierarchy(ouDimension.items)
        ouDimension.itemIds = ouDimension.items.map((item) => item.uid)
    }

    return {
        rows,
        columns,
        allByDimension,
        headerDimensions,
        rowHeaders,
        columnHeaders,
        dataHeaders,
    }
}

const lookup = (
    dataRow,
    dimensionLookup,
    { doColumnSubtotals, doRowSubtotals }
) => {
    let row = 0
    for (const headerIndex of dimensionLookup.rowHeaders) {
        const idx = dimensionLookup.headerDimensions[
            headerIndex
        ].itemIds.indexOf(dataRow[headerIndex])

        if (idx === -1) {
            return undefined
        }

        const size = dimensionLookup.headerDimensions[headerIndex].size
        row += idx * size
    }

    if (doColumnSubtotals) {
        row += Math.floor(row / dimensionLookup.rows[0].size)
    }

    let column = 0
    for (const headerIndex of dimensionLookup.columnHeaders) {
        const idx = dimensionLookup.headerDimensions[
            headerIndex
        ].itemIds.indexOf(dataRow[headerIndex])

        if (idx === -1) {
            return undefined
        }
        const size = dimensionLookup.headerDimensions[headerIndex].size
        column += idx * size
    }

    if (doRowSubtotals) {
        column += Math.floor(column / dimensionLookup.columns[0].size)
    }

    return { column, row }
}

const applyTotalAggregationType = (
    {
        totalAggregationType,
        value,
        numerator,
        denominator,
        multiplier,
        divisor,
    },
    overrideTotalAggregationType
) => {
    switch (overrideTotalAggregationType || totalAggregationType) {
        case AGGREGATE_TYPE_NA:
            return 'N/A'
        case AGGREGATE_TYPE_AVERAGE:
            return (
                ((numerator || value) * multiplier) /
                (denominator * divisor || 1)
            )
        case AGGREGATE_TYPE_SUM:
        default:
            return value
    }
}

export class PivotTableEngine {
    visualization
    rawData
    options
    legendSets

    dimensionLookup
    adaptiveClippingController

    columnDepth = 0
    rowDepth = 0

    height = 0
    width = 0
    data = []
    rowMap = []
    columnMap = []

    constructor(visualization, data, legendSets) {
        this.visualization = Object.assign(
            {},
            defaultVisualizationProps,
            visualization
        )
        this.legendSets = (legendSets || []).reduce((sets, set) => {
            sets[set.id] = set
            return sets
        }, {})
        this.rawData = data

        this.dimensionLookup = buildDimensionLookup(
            this.visualization,
            this.rawData.metaData,
            this.rawData.headers
        )

        this.options = {
            ...defaultOptions,
            showColumnTotals: visualization.colTotals,
            showRowTotals: visualization.rowTotals,
            showColumnSubtotals: visualization.colSubTotals,
            showRowSubtotals: visualization.rowSubTotals,
            hideEmptyColumns: visualization.hideEmptyColumns,
            hideEmptyRows: visualization.hideEmptyRows,
            title: visualization.hideTitle ? undefined : visualization.title,
            subtitle: visualization.hideSubtitle
                ? undefined
                : visualization.subtitle,
            // turn on fixed headers only when there are dimensions
            fixColumnHeaders: this.dimensionLookup.columns.length
                ? visualization.fixColumnHeaders
                : false,
            fixRowHeaders: this.dimensionLookup.rows.length
                ? visualization.fixRowHeaders
                : false,
        }

        this.adaptiveClippingController = new AdaptiveClippingController(this)

        const doColumnSubtotals =
            this.options.showColumnSubtotals &&
            this.dimensionLookup.rows.length > 1
        const singularRow =
            this.dimensionLookup.rows.length === 1 &&
            this.dimensionLookup.rows[0].count === 1
        const firstColumnIsSortable = !doColumnSubtotals && !singularRow

        this.columnDepth =
            this.dimensionLookup.columns.length ||
            (this.visualization.showDimensionLabels || firstColumnIsSortable
                ? 1
                : 0)
        this.rowDepth =
            this.dimensionLookup.rows.length ||
            (this.visualization.showDimensionLabels ? 1 : 0)

        this.buildMatrix()
    }

    getRaw({ row, column }) {
        const cellType = this.getRawCellType({ row, column })
        const dxDimension = this.getRawCellDxDimension({ row, column })

        const headers = [
            ...this.getRawRowHeader(row),
            ...this.getRawColumnHeader(column),
        ]
        const peId = headers.find(
            (header) => header?.dimensionItemType === DIMENSION_TYPE_PERIOD
        )?.uid
        const ouId = headers.find(
            (header) => header?.dimensionItemType === DIMENSION_TYPE_ORGUNIT
        )?.uid

        if (!this.data[row] || !this.data[row][column]) {
            return {
                cellType,
                empty: true,
                ouId,
                peId,
            }
        }

        const dataRow = this.data[row][column]

        let rawValue =
            cellType === CELL_TYPE_VALUE
                ? dataRow[this.dimensionLookup.dataHeaders.value]
                : dataRow.value
        let renderedValue = rawValue
        const valueType = dxDimension?.valueType || VALUE_TYPE_TEXT

        if (valueType === VALUE_TYPE_NUMBER) {
            rawValue = parseValue(rawValue)
            switch (this.visualization.numberType) {
                case NUMBER_TYPE_ROW_PERCENTAGE:
                    renderedValue = rawValue / this.percentageTotals[row].value
                    break
                case NUMBER_TYPE_COLUMN_PERCENTAGE:
                    renderedValue =
                        rawValue / this.percentageTotals[column].value
                    break
                default:
                    break
            }
        }

        renderedValue = renderValue(
            renderedValue,
            valueType,
            this.visualization
        )

        return {
            cellType,
            empty: false,
            valueType,
            rawValue,
            renderedValue,
            dxDimension,
            ouId,
            peId,
        }
    }

    get({ row, column }) {
        const mappedRow = this.rowMap[row],
            mappedColumn = this.columnMap[column]
        if (
            (!mappedRow && mappedRow !== 0) ||
            (!mappedColumn && mappedColumn !== 0)
        ) {
            return undefined
        }

        return this.getRaw({ row: mappedRow, column: mappedColumn })
    }

    getRawCellType({ row, column }) {
        const isRowTotal = this.doRowTotals && column === this.dataWidth - 1
        const isColumnTotal = this.doColumnTotals && row === this.dataHeight - 1
        if (isRowTotal || isColumnTotal) {
            return CELL_TYPE_TOTAL
        }

        const isRowSubtotal =
            this.doRowSubtotals &&
            (column + 1) % (this.dimensionLookup.columns[0].size + 1) === 0
        const isColumnSubtotal =
            this.doColumnSubtotals &&
            (row + 1) % (this.dimensionLookup.rows[0].size + 1) === 0

        if (isRowSubtotal || isColumnSubtotal) {
            return CELL_TYPE_SUBTOTAL
        }

        return CELL_TYPE_VALUE
    }
    getCellType({ row, column }) {
        row = this.rowMap[row]
        column = this.columnMap[column]
        return this.getRawCellType({ row, column })
    }

    getDimensionLabel(rowLevel, columnLevel) {
        const lastRowLevel = this.rowDepth - 1
        const lastColumnLevel = this.columnDepth - 1

        if (rowLevel !== lastRowLevel && columnLevel !== lastColumnLevel) {
            return null
        }
        if (
            rowLevel === lastRowLevel &&
            this.dimensionLookup.rows[lastRowLevel] &&
            columnLevel === lastColumnLevel &&
            this.dimensionLookup.columns[lastColumnLevel]
        ) {
            return `${this.dimensionLookup.rows[lastRowLevel].meta.name} / ${this.dimensionLookup.columns[lastColumnLevel].meta.name}`
        }

        if (lastRowLevel === -1) {
            return this.dimensionLookup.columns[columnLevel].meta.name
        }
        if (lastColumnLevel === -1) {
            return this.dimensionLookup.rows[rowLevel].meta.name
        }

        if (
            rowLevel === lastRowLevel &&
            this.dimensionLookup.columns[columnLevel]
        ) {
            return this.dimensionLookup.columns[columnLevel].meta.name
        }
        if (
            columnLevel === lastColumnLevel &&
            this.dimensionLookup.rows[rowLevel]
        ) {
            return this.dimensionLookup.rows[rowLevel].meta.name
        }
    }

    getCellDxDimension({ row, column }) {
        return this.getRawCellDxDimension({
            row: this.rowMap[row],
            column: this.columnMap[column],
        })
    }
    getRawCellDxDimension({ row, column }) {
        if (!this.data[row]) {
            return undefined
        }
        const cellValue = this.data[row][column]
        if (!cellValue) {
            return undefined
        }
        if (!Array.isArray(cellValue)) {
            // This is a total cell
            return {
                valueType: cellValue.valueType,
                totalAggregationType: cellValue.totalAggregationType,
                legendSet: undefined,
            }
        }

        const rowHeaders = this.getRawRowHeader(row)
        const columnHeaders = this.getRawColumnHeader(column)

        const dxRowIndex = this.dimensionLookup.rows.findIndex(
            (dim) => dim.isDxDimension
        )
        if (rowHeaders.length && dxRowIndex !== -1) {
            return {
                valueType: rowHeaders[dxRowIndex].valueType,
                totalAggregationType:
                    rowHeaders[dxRowIndex].totalAggregationType,
                legendSet: rowHeaders[dxRowIndex].legendSet,
            }
        }

        const dxColumnIndex = this.dimensionLookup.columns.findIndex(
            (dim) => dim.isDxDimension
        )
        if (columnHeaders.length && dxColumnIndex !== -1) {
            return {
                valueType: columnHeaders[dxColumnIndex].valueType,
                totalAggregationType:
                    columnHeaders[dxColumnIndex].totalAggregationType,
                legendSet: columnHeaders[dxColumnIndex].legendSet,
            }
        }

        // Data is in Filter
        // TODO : This assumes the server ignores text types, we should confirm this is the case
        return {
            valueType: VALUE_TYPE_NUMBER,
            totalAggregationType: AGGREGATE_TYPE_SUM,
        }
    }

    rowIsEmpty(row) {
        return !this.data[row] || this.data[row].length === 0
    }
    columnIsEmpty(column) {
        return !this.adaptiveClippingController.columns.sizes[column]
    }

    getRawColumnHeader(column) {
        if (this.doRowTotals && column === this.dataWidth - 1) {
            return times(this.columnDepth - 1, () => undefined).concat([
                { name: 'Total' },
            ])
        }
        if (this.doRowSubtotals) {
            if (
                (column + 1) % (this.dimensionLookup.columns[0].size + 1) ===
                0
            ) {
                return times(this.columnDepth - 1, () => undefined).concat([
                    { name: 'Subtotal' },
                ])
            }
            column -= Math.floor(
                column / (this.dimensionLookup.columns[0].size + 1)
            )
        }
        return this.dimensionLookup.columns.map((dimension) => {
            const itemIndex =
                Math.floor(column / dimension.size) % dimension.count
            return dimension.items[itemIndex]
        })
    }
    getColumnHeader(column) {
        return this.getRawColumnHeader(this.columnMap[column])
    }

    getRawRowHeader(row) {
        if (this.doColumnTotals && row === this.dataHeight - 1) {
            return times(this.rowDepth - 1, () => undefined).concat([
                { name: 'Total' },
            ])
        }
        if (this.doColumnSubtotals) {
            if ((row + 1) % (this.dimensionLookup.rows[0].size + 1) === 0) {
                return times(this.rowDepth - 1, () => undefined).concat([
                    { name: 'Subtotal' },
                ])
            }
            row -= Math.floor(row / (this.dimensionLookup.rows[0].size + 1))
        }

        return this.dimensionLookup.rows.map((dimension) => {
            const itemIndex = Math.floor(row / dimension.size) % dimension.count
            return dimension.items[itemIndex]
        })
    }
    getRowHeader(row) {
        return this.getRawRowHeader(this.rowMap[row])
    }

    getDependantTotalCells({ row, column }) {
        const rowSubtotalSize = this.dimensionLookup.columns[0]?.size + 1
        const rowSubtotal = rowSubtotalSize &&
            this.doRowSubtotals && {
                row,
                column:
                    Math.ceil((column + 1) / rowSubtotalSize) *
                        rowSubtotalSize -
                    1,
                size: rowSubtotalSize - 1,
            }
        const rowSubtotalColumnTotal = this.doRowSubtotals &&
            this.doColumnTotals && {
                row: this.dataHeight - 1,
                column: rowSubtotal.column,
                size: this.rawDataHeight,
            }

        const columnSubtotalSize = this.dimensionLookup.rows[0]?.size + 1
        const columnSubtotal = columnSubtotalSize &&
            this.doColumnSubtotals && {
                row:
                    Math.ceil((row + 1) / columnSubtotalSize) *
                        columnSubtotalSize -
                    1,
                column,
                size: columnSubtotalSize - 1,
            }

        const columnSubtotalRowTotal = this.doColumnSubtotals &&
            this.doRowTotals && {
                row: columnSubtotal.row,
                column: this.dataWidth - 1,
                size: this.rawDataWidth,
            }

        const combinedSubtotal = rowSubtotalSize &&
            columnSubtotalSize &&
            this.doColumnSubtotals &&
            this.doRowSubtotals && {
                row: columnSubtotal.row,
                column: rowSubtotal.column,
                size: columnSubtotalSize * rowSubtotalSize,
            }

        const rowTotal = this.doRowTotals && {
            row,
            column: this.dataWidth - 1,
            size: this.rawDataWidth,
        }

        const columnTotal = this.doColumnTotals && {
            row: this.dataHeight - 1,
            column,
            size: this.rawDataHeight,
        }

        const combinedTotal = this.doColumnTotals &&
            this.doRowTotals && {
                row: this.dataHeight - 1,
                column: this.dataWidth - 1,
                size: this.rawDataHeight * this.rawDataWidth,
            }

        return {
            rowSubtotal,
            rowSubtotalColumnTotal,
            columnSubtotal,
            columnSubtotalRowTotal,
            rowTotal,
            columnTotal,
            combinedSubtotal,
            combinedTotal,
        }
    }

    addCellValueToTotals(pos, dataRow) {
        const totals = this.getDependantTotalCells(pos)
        const dxDimension = this.getRawCellDxDimension(pos)

        Object.values(totals).forEach((totalItem) => {
            if (!totalItem) {
                return
            }

            this.data[totalItem.row] = this.data[totalItem.row] || []

            this.data[totalItem.row][totalItem.column] = this.data[
                totalItem.row
            ][totalItem.column] || {
                count: 0,
                totalCount: totalItem.size,
            }
            const totalCell = this.data[totalItem.row][totalItem.column]

            const currentAggType = dxDimension?.totalAggregationType
            const previousAggType =
                totalCell.totalAggregationType || currentAggType
            if (previousAggType && currentAggType !== previousAggType) {
                totalCell.totalAggregationType = AGGREGATE_TYPE_NA
            } else {
                totalCell.totalAggregationType = currentAggType
            }

            const currentValueType = dxDimension?.valueType
            const previousValueType = totalCell.valueType
            if (previousValueType && currentValueType !== previousValueType) {
                totalCell.valueType = AGGREGATE_TYPE_NA
            } else {
                totalCell.valueType = currentValueType
            }

            if (dxDimension?.valueType === VALUE_TYPE_NUMBER) {
                dataFields.forEach((field) => {
                    const headerIndex = this.dimensionLookup.dataHeaders[field]
                    const value = parseValue(dataRow[headerIndex])
                    if (value && !isNaN(value)) {
                        totalCell[field] = (totalCell[field] || 0) + value
                    }
                })
            }
            totalCell.count += 1
        })

        if (this.visualization.numberType === NUMBER_TYPE_ROW_PERCENTAGE) {
            if (!this.percentageTotals[pos.row]) {
                this.percentageTotals[pos.row] = {
                    count: 0,
                    totalCount: this.rawDataWidth,
                }
            }
            const percentageTotal = this.percentageTotals[pos.row]
            dataFields.forEach((field) => {
                const headerIndex = this.dimensionLookup.dataHeaders[field]
                const value = parseValue(dataRow[headerIndex])
                if (value && !isNaN(value)) {
                    percentageTotal[field] =
                        (percentageTotal[field] || 0) + value
                }
            })

            if (totals.columnSubtotal) {
                if (!this.percentageTotals[totals.columnSubtotal.row]) {
                    this.percentageTotals[totals.columnSubtotal.row] = {
                        count: 0,
                        totalCount: this.rawDataWidth,
                    }
                }
                const percentageTotal =
                    this.percentageTotals[totals.columnSubtotal.row]
                dataFields.forEach((field) => {
                    const headerIndex = this.dimensionLookup.dataHeaders[field]
                    const value = parseValue(dataRow[headerIndex])
                    if (value && !isNaN(value)) {
                        percentageTotal[field] =
                            (percentageTotal[field] || 0) + value
                    }
                })
            }

            if (totals.columnTotal) {
                if (!this.percentageTotals[totals.columnTotal.row]) {
                    this.percentageTotals[totals.columnTotal.row] = {
                        count: 0,
                        totalCount: this.rawDataWidth,
                    }
                }
                const percentageTotal =
                    this.percentageTotals[totals.columnTotal.row]
                dataFields.forEach((field) => {
                    const headerIndex = this.dimensionLookup.dataHeaders[field]
                    const value = parseValue(dataRow[headerIndex])
                    if (value && !isNaN(value)) {
                        percentageTotal[field] =
                            (percentageTotal[field] || 0) + value
                    }
                })
            }
        }

        if (this.visualization.numberType === NUMBER_TYPE_COLUMN_PERCENTAGE) {
            if (!this.percentageTotals[pos.column]) {
                this.percentageTotals[pos.column] = {
                    count: 0,
                    totalCount: this.rawDataHeight,
                }
            }
            const percentageTotal = this.percentageTotals[pos.column]
            dataFields.forEach((field) => {
                const headerIndex = this.dimensionLookup.dataHeaders[field]
                const value = parseValue(dataRow[headerIndex])
                if (value && !isNaN(value)) {
                    percentageTotal[field] =
                        (percentageTotal[field] || 0) + value
                }
            })

            if (totals.rowSubtotal) {
                if (!this.percentageTotals[totals.rowSubtotal.column]) {
                    this.percentageTotals[totals.rowSubtotal.column] = {
                        count: 0,
                        totalCount: this.rawDataHeight,
                    }
                }
                const percentageTotal =
                    this.percentageTotals[totals.rowSubtotal.column]
                dataFields.forEach((field) => {
                    const headerIndex = this.dimensionLookup.dataHeaders[field]
                    const value = parseValue(dataRow[headerIndex])
                    if (value && !isNaN(value)) {
                        percentageTotal[field] =
                            (percentageTotal[field] || 0) + value
                    }
                })
            }

            if (totals.rowTotal) {
                if (!this.percentageTotals[totals.rowTotal.column]) {
                    this.percentageTotals[totals.rowTotal.column] = {
                        count: 0,
                        totalCount: this.rawDataHeight,
                    }
                }
                const percentageTotal =
                    this.percentageTotals[totals.rowTotal.column]
                dataFields.forEach((field) => {
                    const headerIndex = this.dimensionLookup.dataHeaders[field]
                    const value = parseValue(dataRow[headerIndex])
                    if (value && !isNaN(value)) {
                        percentageTotal[field] =
                            (percentageTotal[field] || 0) + value
                    }
                })
            }
        }
    }
    finalizeTotal({ row, column }) {
        if (!this.data[row]) {
            return
        }
        const totalCell = this.data[row][column]
        if (totalCell && totalCell.count) {
            totalCell.value = applyTotalAggregationType(
                totalCell,
                this.visualization.numberType !== NUMBER_TYPE_VALUE &&
                    AGGREGATE_TYPE_SUM
            )
            this.adaptiveClippingController.add(
                { row, column },
                renderValue(
                    totalCell.value,
                    totalCell.valueType,
                    this.visualization
                )
            )
        }
    }

    finalizeTotals() {
        const columnSubtotalSize = this.dimensionLookup.rows[0]?.size + 1
        const rowSubtotalSize = this.dimensionLookup.columns[0]?.size + 1

        if (this.doRowSubtotals && rowSubtotalSize) {
            times(
                this.dimensionLookup.columns[0].count,
                (n) => (n + 1) * rowSubtotalSize - 1
            ).forEach((column) => {
                times(
                    this.dataHeight - (this.doColumnTotals ? 1 : 0),
                    (n) => n
                ).forEach((row) => {
                    // skip combined subtotal cells
                    if (
                        !this.doColumnSubtotals ||
                        (row + 1) % columnSubtotalSize !== 0
                    ) {
                        this.finalizeTotal({ row, column })
                    }
                })
            })
        }
        if (this.doColumnSubtotals && columnSubtotalSize) {
            times(
                this.dimensionLookup.rows[0].count,
                (n) => (n + 1) * columnSubtotalSize - 1
            ).forEach((row) => {
                times(
                    this.dataWidth - (this.doRowTotals ? 1 : 0),
                    (n) => n
                ).forEach((column) => {
                    // skip combined subtotal cells
                    if (
                        !this.doRowSubtotals ||
                        (column + 1) % rowSubtotalSize !== 0
                    ) {
                        this.finalizeTotal({ row, column })
                    }
                })
            })
        }

        // Combined subtotal cells
        if (
            this.doRowSubtotals &&
            this.doColumnSubtotals &&
            rowSubtotalSize &&
            columnSubtotalSize
        ) {
            times(
                this.dimensionLookup.rows[0].count,
                (n) => (n + 1) * columnSubtotalSize - 1
            ).forEach((row) => {
                times(
                    this.dimensionLookup.columns[0].count,
                    (n) => (n + 1) * rowSubtotalSize - 1
                ).forEach((column) => {
                    this.finalizeTotal({ row, column })
                })
            })
        }
        if (this.doRowTotals) {
            const column = this.dataWidth - 1
            const rowCount = this.doColumnTotals
                ? this.dataHeight - 1
                : this.dataHeight
            times(rowCount, (n) => n).forEach((row) => {
                this.finalizeTotal({ row, column })
            })
        }

        if (this.doColumnTotals) {
            const row = this.dataHeight - 1
            const colCount = this.doRowTotals
                ? this.dataWidth - 1
                : this.dataWidth
            times(colCount, (n) => n).forEach((column) => {
                this.finalizeTotal({ row, column })
            })
        }

        if (this.doRowTotals && this.doColumnTotals) {
            this.finalizeTotal({
                row: this.dataHeight - 1,
                column: this.dataWidth - 1,
            })
        }

        if (this.percentageTotals) {
            this.percentageTotals.forEach((item) => {
                item.value = applyTotalAggregationType(item)
            })
        }
    }

    resetRowMap() {
        this.rowMap = this.options.hideEmptyRows
            ? times(this.dataHeight, (n) => n).filter((idx) => !!this.data[idx])
            : times(this.dataHeight, (n) => n)
    }

    resetColumnMap() {
        this.columnMap = this.options.hideEmptyColumns
            ? times(this.dataWidth, (n) => n).filter(
                  (idx) => !this.columnIsEmpty(idx)
              )
            : times(this.dataWidth, (n) => n)
    }

    get cellPadding() {
        switch (this.visualization.displayDensity) {
            case DISPLAY_DENSITY_OPTION_COMPACT:
                return DISPLAY_DENSITY_PADDING_COMPACT
            case DISPLAY_DENSITY_OPTION_COMFORTABLE:
                return DISPLAY_DENSITY_PADDING_COMFORTABLE
            case DISPLAY_DENSITY_OPTION_NORMAL:
            default:
                return DISPLAY_DENSITY_PADDING_NORMAL
        }
    }

    get fontSize() {
        switch (this.visualization.fontSize) {
            case FONT_SIZE_OPTION_SMALL:
                return FONT_SIZE_SMALL
            case FONT_SIZE_OPTION_LARGE:
                return FONT_SIZE_LARGE
            case FONT_SIZE_OPTION_NORMAL:
            default:
                return FONT_SIZE_NORMAL
        }
    }

    get scrollIconBuffer() {
        switch (this.visualization.fontSize) {
            case FONT_SIZE_OPTION_SMALL:
                return 11
            case FONT_SIZE_OPTION_LARGE:
                return 15
            case FONT_SIZE_OPTION_NORMAL:
            default:
                return 13
        }
    }

    buildMatrix() {
        this.data = []
        this.adaptiveClippingController.reset()

        this.dataHeight = this.rawDataHeight = countFromDisaggregates(
            this.dimensionLookup.rows
        )

        this.dataWidth = this.rawDataWidth = countFromDisaggregates(
            this.dimensionLookup.columns
        )

        // TODO: Check last row/col dimension for size===1, skip redundant sub-totals
        this.doRowSubtotals =
            this.options.showRowSubtotals && this.columnDepth > 1
        this.doColumnSubtotals =
            this.options.showColumnSubtotals && this.rowDepth > 1

        this.doRowTotals = this.options.showRowTotals && this.dataWidth > 1
        this.doColumnTotals =
            this.options.showColumnTotals && this.dataHeight > 1

        if (this.doRowSubtotals) {
            this.dataWidth += this.dimensionLookup.columns[0].count
        }
        if (this.doColumnSubtotals) {
            this.dataHeight += this.dimensionLookup.rows[0].count
        }
        if (this.doRowTotals) {
            this.dataWidth += 1
        }
        if (this.doColumnTotals) {
            this.dataHeight += 1
        }

        // TODO: Use total cell calculation, don't duplicate here
        if (
            this.visualization.numberType === NUMBER_TYPE_ROW_PERCENTAGE ||
            this.visualization.numberType === NUMBER_TYPE_COLUMN_PERCENTAGE
        ) {
            this.percentageTotals = []
        }

        this.rawData.rows.forEach((dataRow) => {
            const pos = lookup(dataRow, this.dimensionLookup, this)

            if (pos) {
                this.data[pos.row] = this.data[pos.row] || []
                this.data[pos.row][pos.column] = dataRow

                this.addCellValueToTotals(pos, dataRow)
            }
        })

        this.finalizeTotals()

        this.rawData.rows.forEach((dataRow) => {
            const pos = lookup(dataRow, this.dimensionLookup, this)
            if (pos) {
                this.adaptiveClippingController.add(
                    pos,
                    this.getRaw(pos).renderedValue
                )
            }
        })

        this.resetRowMap()
        this.resetColumnMap()

        this.height = this.rowMap.length
        this.width = this.columnMap.length

        this.adaptiveClippingController.finalize()
    }

    getColumnType(column) {
        column = this.columnMap[column]
        if (!column && column !== 0) {
            return undefined
        }
        if (
            this.doRowSubtotals &&
            (column + 1) % (this.dimensionLookup.columns[0].size + 1) === 0
        ) {
            return CELL_TYPE_SUBTOTAL
        }
        if (this.doRowTotals && column === this.dataWidth - 1) {
            return CELL_TYPE_TOTAL
        }
        return CELL_TYPE_VALUE
    }

    isSortable(column) {
        return (
            this.dataHeight > 1 &&
            !this.doColumnSubtotals &&
            this.getColumnType(column) !== undefined
        )
    }

    sort(column, order) {
        if (order !== SORT_ORDER_ASCENDING && order !== SORT_ORDER_DESCENDING) {
            console.warn(`Invalid sort order ${order}`)
            return
        }

        if (!this.isSortable(column)) {
            console.warn(`Invalid sort column ${column}`)
            return
        }

        const mappedColumn = this.columnMap[column]
        this.rowMap.sort((rowA, rowB) => {
            if (this.doColumnTotals && rowA === this.dataHeight - 1) {
                return 1
            }
            if (this.doColumnTotals && rowB === this.dataHeight - 1) {
                return -1
            }
            const valueA = this.getRaw({ row: rowA, column: mappedColumn })
            const valueB = this.getRaw({ row: rowB, column: mappedColumn })

            if ((!valueA || valueA.empty) && (!valueB || valueB.empty)) {
                return 0
            }
            if (!valueA || valueA.empty) {
                return -1 * order
            }
            if (!valueB || valueB.empty) {
                return 1 * order
            }

            if (
                valueA.valueType === VALUE_TYPE_NUMBER &&
                valueB.valueType === VALUE_TYPE_NUMBER
            ) {
                return (valueA.rawValue - valueB.rawValue) * order
            }
            return (
                valueA.renderedValue.localeCompare(valueB.renderedValue) * order
            )
        })

        this.adaptiveClippingController.resetRowPartitions()
    }

    clearSort() {
        this.resetRowMap()
        this.adaptiveClippingController.resetRowPartitions()
    }
}
