import times from 'lodash/times'
import { parseValue } from './parseValue'
import {
    DIMENSION_ID_DATA,
    DIMENSION_ID_PERIOD,
    DIMENSION_ID_ORGUNIT,
} from '../predefinedDimensions'

export const SORT_ORDER_ASCENDING = 1
export const SORT_ORDER_DESCENDING = -1

const dataFields = [
    'value',
    'numerator',
    'denominator',
    'factor',
    'multiplier',
    'divisor',
]

const CELL_TYPE_VALUE = 'value'
const CELL_TYPE_SUBTOTAL = 'subtotal'
const CELL_TYPE_TOTAL = 'total'

const defaultOptions = {
    hideEmptyColumns: false,
    hideEmptyRows: false,
    showRowTotals: false,
    showColumnTotals: false,
    showRowSubtotals: false,
    showColumnSubtotals: false,
    aggregateType: 'count',
}

const AGGREGATE_TYPE_SUM = 'SUM'
const AGGREGATE_TYPE_AVERAGE = 'AVERAGE'
const AGGREGATE_TYPE_NA = 'N/A'

const countFromDisaggregates = list => {
    if (list.length === 0) {
        return 0
    }

    let count = 1
    list.forEach(x => {
        count *= x.items.length
    })
    return count
}

const addSize = list => {
    const reversedList = list.slice().reverse()
    reversedList.forEach((level, idx) => {
        // Start at the "leaf" disaggregate
        const lastLevel = reversedList[idx - 1]
        level.size = lastLevel ? lastLevel.count * lastLevel.size : 1
    })
}

const listByDimension = list =>
    list.reduce((all, item) => {
        all[item.dimension] = item
        return all
    }, {})

const getPrimaryDimension = (metadata, name) => {
    return metadata.dimensions[name]
        ? metadata.dimensions[name].reduce((out, id) => {
              out[id] = metadata.items[id]
              return out
          }, {})
        : {}
}

const buildDimensionLookup = (visualization, metadata, headers) => {
    const rows = visualization.rows.map(row => ({
        dimension: row.dimension,
        meta: metadata.items[row.dimension],
        count: metadata.dimensions[row.dimension].length,
        itemIds: metadata.dimensions[row.dimension],
        items: metadata.dimensions[row.dimension].map(
            item => metadata.items[item]
        ),
        position: 'row',
    }))
    const columns = visualization.columns.map(column => ({
        dimension: column.dimension,
        meta: metadata.items[column.dimension],
        count: metadata.dimensions[column.dimension].length,
        itemIds: metadata.dimensions[column.dimension],
        items: metadata.dimensions[column.dimension].map(
            item => metadata.items[item]
        ),
        position: 'column',
    }))

    addSize(rows)
    addSize(columns)

    const allByDimension = {
        ...listByDimension(rows),
        ...listByDimension(columns),
    }

    const headerDimensions = headers.map(header => allByDimension[header.name])

    const rowHeaders = headerDimensions
        .map((_, idx) => idx)
        .filter(
            idx =>
                headerDimensions[idx] &&
                headerDimensions[idx].position === 'row'
        )
    const columnHeaders = headerDimensions
        .map((_, idx) => idx)
        .filter(
            idx =>
                headerDimensions[idx] &&
                headerDimensions[idx].position === 'column'
        )

    const dataHeaders = dataFields.reduce((out, field) => {
        out[field] = headers.findIndex(header => header.name === field)
        return out
    }, {})

    const primaryDimensions = {
        data: getPrimaryDimension(metadata, DIMENSION_ID_DATA),
        period: getPrimaryDimension(metadata, DIMENSION_ID_PERIOD),
        orgUnit: getPrimaryDimension(metadata, DIMENSION_ID_ORGUNIT),
    }

    if (metadata.ouNameHierarchy) {
        Object.keys(primaryDimensions.orgUnit).forEach(ou => {
            const hierarchy = metadata.ouNameHierarchy[ou]
            if (hierarchy) {
                primaryDimensions.orgUnit[ou].hierarchy = hierarchy
                    .split('/')
                    .filter(x => x.length)
            }
        })
    }

    return {
        rows,
        columns,
        allByDimension,
        headerDimensions,
        rowHeaders,
        columnHeaders,
        dataHeaders,
        primaryDimensions,
    }
}

const lookup = (
    dataRow,
    dimensionLookup,
    { doColumnSubtotals, doRowSubtotals }
) => {
    let row = 0
    dimensionLookup.rowHeaders.forEach(headerIndex => {
        const idx = dimensionLookup.headerDimensions[
            headerIndex
        ].itemIds.indexOf(dataRow[headerIndex])
        const size = dimensionLookup.headerDimensions[headerIndex].size
        row += idx * size
    })

    if (doColumnSubtotals) {
        row += Math.floor(row / dimensionLookup.rows[0].size)
    }

    let column = 0
    dimensionLookup.columnHeaders.forEach(headerIndex => {
        const idx = dimensionLookup.headerDimensions[
            headerIndex
        ].itemIds.indexOf(dataRow[headerIndex])
        const size = dimensionLookup.headerDimensions[headerIndex].size
        column += idx * size
    })

    if (doRowSubtotals) {
        column += Math.floor(column / dimensionLookup.columns[0].size)
    }

    return { column, row }
}

const applyTotalAggregationType = ({
    totalAggregationType,
    value,
    numerator,
    denominator,
    multiplier,
    divisor,
}) => {
    switch (totalAggregationType) {
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

    columnDepth = 0
    rowDepth = 0

    height = 0
    width = 0
    data = []
    occupiedColumns = []
    rowMap = []
    columnMap = []

    constructor(visualization, data, legendSets) {
        this.visualization = visualization
        this.legendSets = (legendSets || []).reduce((sets, set) => {
            sets[set.id] = set
            return sets
        }, {})
        this.rawData = data
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
        }

        this.dimensionLookup = buildDimensionLookup(
            this.visualization,
            this.rawData.metaData,
            this.rawData.headers
        )

        this.columnDepth = this.dimensionLookup.columns.length
        this.rowDepth = this.dimensionLookup.rows.length

        this.buildMatrix()
    }

    getRaw({ row, column }) {
        const type = this.getRawCellType({ row, column })
        if (this.data[row]) {
            const dataRow = this.data[row][column]
            if (dataRow) {
                switch (type) {
                    case CELL_TYPE_VALUE:
                        return (
                            dataRow[this.dimensionLookup.dataHeaders.value] ??
                            undefined
                        )
                    default:
                        return dataRow.value ?? undefined
                }
            }
        }
        return undefined
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
        const isRowTotal =
            this.options.showRowTotals && column === this.dataWidth - 1
        const isColumnTotal =
            this.options.showColumnTotals && row === this.dataHeight - 1
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

    getCellDxDimension({ row, column }) {
        return this.getRawCellDxDimension({
            row: this.rowMap[row],
            column: this.columnMap[column],
        })
    }
    getRawCellDxDimension({ row, column }) {
        const rowHeaders = this.getRawRowHeader(row)
        const columnHeaders = this.getRawColumnHeader(column)

        if (!rowHeaders.length || !columnHeaders.length) {
            return undefined
        }

        const dxRowIndex = this.dimensionLookup.rows.findIndex(
            dim => dim.dimension === 'dx'
        )
        if (dxRowIndex !== -1) {
            return rowHeaders[dxRowIndex]
        }

        const dxColumnIndex = this.dimensionLookup.columns.findIndex(
            dim => dim.dimension === 'dx'
        )
        if (dxColumnIndex !== -1) {
            return columnHeaders[dxColumnIndex]
        }
    }

    rowIsEmpty(row) {
        return !this.data[row] || this.data[row].length === 0
    }
    columnIsEmpty(column) {
        return !this.occupiedColumns[column]
    }

    getRawColumnHeader(column) {
        return this.dimensionLookup.columns.map(dimension => {
            const itemIndex =
                Math.floor(column / dimension.size) % dimension.count
            return dimension.items[itemIndex]
        })
    }
    getColumnHeader(column) {
        column = this.columnMap[column]
        if (this.options.showRowTotals && column === this.dataWidth - 1) {
            return times(
                this.dimensionLookup.columns.length - 1,
                () => undefined
            ).concat([{ name: 'Total' }])
        }
        if (this.doRowSubtotals) {
            if (
                (column + 1) % (this.dimensionLookup.columns[0].size + 1) ===
                0
            ) {
                return times(
                    this.dimensionLookup.columns.length - 1,
                    () => undefined
                ).concat([{ name: 'Subtotal' }])
            }
            column -= Math.floor(
                column / (this.dimensionLookup.columns[0].size + 1)
            )
        }
        return this.getRawColumnHeader(column)
    }

    getRawRowHeader(row) {
        return this.dimensionLookup.rows.map(dimension => {
            const itemIndex = Math.floor(row / dimension.size) % dimension.count
            return dimension.items[itemIndex]
        })
    }
    getRowHeader(row) {
        row = this.rowMap[row]
        if (this.options.showColumnTotals && row === this.dataHeight - 1) {
            return times(
                this.dimensionLookup.rows.length - 1,
                () => undefined
            ).concat([{ name: 'Total' }])
        }
        if (this.doColumnSubtotals) {
            if ((row + 1) % (this.dimensionLookup.rows[0].size + 1) === 0) {
                return times(
                    this.dimensionLookup.rows.length - 1,
                    () => undefined
                ).concat([{ name: 'Subtotal' }])
            }
            row -= Math.floor(row / (this.dimensionLookup.rows[0].size + 1))
        }
        return this.getRawRowHeader(row)
    }

    getDependantTotalCells({ row, column }) {
        const rowSubtotalSize = this.dimensionLookup.columns[0].size + 1
        const rowSubtotal = this.doRowSubtotals && {
            row,
            column:
                Math.ceil((column + 1) / rowSubtotalSize) * rowSubtotalSize - 1,
            size: rowSubtotalSize - 1,
        }
        const rowSubtotalColumnTotal = this.doColumnSubtotals &&
            this.options.showRowTotals && {
                row: this.dataHeight - 1,
                column: rowSubtotal.column,
                size: this.rawDataWidth,
            }

        const columnSubtotalSize = this.dimensionLookup.rows[0].size + 1
        const columnSubtotal = this.options.showColumnSubtotals && {
            row:
                Math.ceil((row + 1) / columnSubtotalSize) * columnSubtotalSize -
                1,
            column,
            size: columnSubtotalSize - 1,
        }

        const columnSubtotalRowTotal = this.doColumnSubtotals &&
            this.options.showRowTotals && {
                row: columnSubtotal.row,
                column: this.dataWidth - 1,
                size: this.rawDataWidth,
            }

        const combinedSubtotal = this.doColumnSubtotals &&
            this.doRowSubtotals && {
                row: columnSubtotal.row,
                column: rowSubtotal.column,
                size: columnSubtotalSize * rowSubtotalSize,
            }

        const rowTotal = this.options.showRowTotals && {
            row,
            column: this.dataWidth - 1,
            size: this.rawDataWidth,
        }

        const columnTotal = this.options.showColumnTotals && {
            row: this.dataHeight - 1,
            column,
            size: this.rawDataHeight,
        }

        const combinedTotal = this.options.showColumnTotals &&
            this.options.showRowTotals && {
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

        Object.values(totals).forEach(totalItem => {
            if (!totalItem) return

            this.data[totalItem.row] = this.data[totalItem.row] || []
            this.occupiedColumns[totalItem.column] = true

            this.data[totalItem.row][totalItem.column] = this.data[
                totalItem.row
            ][totalItem.column] || {
                count: 0,
                totalCount: totalItem.size,
            }
            const totalCell = this.data[totalItem.row][totalItem.column]

            const previousAggType =
                totalCell.totalAggregationType || currentAggType
            const currentAggType = dxDimension?.totalAggregationType
            if (previousAggType && currentAggType !== previousAggType) {
                totalCell.totalAggregationType = AGGREGATE_TYPE_NA
            } else {
                totalCell.totalAggregationType = currentAggType
            }

            if (dxDimension?.valueType === 'NUMBER') {
                dataFields.forEach(field => {
                    const headerIndex = this.dimensionLookup.dataHeaders[field]
                    const value = parseValue(dataRow[headerIndex])
                    if (value && !isNaN(value)) {
                        totalCell[field] = (totalCell[field] || 0) + value
                    }
                })
            }
            totalCell.count += 1
        })
    }
    finalizeTotals() {
        const columnSubtotalSize = this.dimensionLookup.rows[0].size + 1
        const rowSubtotalSize = this.dimensionLookup.columns[0].size + 1

        // TODO: consolidate total lookup and aggregate calculation logics

        if (this.doRowSubtotals) {
            times(
                this.dimensionLookup.columns[0].count,
                n => (n + 1) * rowSubtotalSize - 1
            ).forEach(column => {
                times(this.dataHeight, n => n).forEach(row => {
                    // skip combined subtotal cells for now
                    if (
                        !this.doColumnSubtotals ||
                        row % this.dimensionLookup.rows[0].count !== 0
                    ) {
                        if (!this.data[row]) {
                            return
                        }
                        const totalCell = this.data[row][column]
                        if (totalCell && totalCell.count) {
                            totalCell.value = applyTotalAggregationType(
                                totalCell
                            )
                        }
                    }
                })
            })
        }
        if (this.doColumnSubtotals) {
            times(
                this.dimensionLookup.rows[0].count,
                n => (n + 1) * columnSubtotalSize - 1
            ).forEach(row => {
                times(this.dataWidth, n => n).forEach(column => {
                    // skip combined subtotal cells for now
                    if (
                        !this.doRowSubtotals ||
                        column % this.dimensionLookup.columns[0].count !== 0
                    ) {
                        if (!this.data[row]) {
                            return
                        }
                        const totalCell = this.data[row][column]
                        if (totalCell && totalCell.count) {
                            totalCell.value = applyTotalAggregationType(
                                totalCell
                            )
                        }
                    }
                })
            })
        }

        if (this.doRowSubtotals && this.doColumnSubtotals) {
            times(
                this.dimensionLookup.rows[0].count,
                n => (n + 1) * columnSubtotalSize - 1
            ).forEach(row => {
                times(
                    this.dimensionLookup.columns[0].count,
                    n => (n + 1) * rowSubtotalSize - 1
                ).forEach(column => {
                    if (!this.data[row]) {
                        return
                    }
                    const totalCell = this.data[row][column]
                    if (totalCell && totalCell.count) {
                        totalCell.value = applyTotalAggregationType(totalCell)
                    }
                })
            })
        }
        if (this.options.showRowTotals) {
            const column = this.dataWidth - 1
            times(this.dataHeight, n => n).forEach(row => {
                if (!this.data[row]) {
                    return
                }
                const totalCell = this.data[row][column]
                if (totalCell && totalCell.count) {
                    totalCell.value = applyTotalAggregationType(totalCell)
                }
            })
        }

        if (this.options.showColumnTotals) {
            const row = this.dataHeight - 1
            times(this.dataWidth, n => n).forEach(column => {
                const totalCell = this.data[row][column]
                if (totalCell && totalCell.count) {
                    totalCell.value = applyTotalAggregationType(totalCell)
                }
            })
        }
    }

    resetRowmap() {
        this.rowMap = this.options.hideEmptyRows
            ? times(this.dataHeight, n => n).filter(idx => !!this.data[idx])
            : times(this.dataHeight, n => n)
    }

    buildMatrix() {
        this.data = []
        this.occupiedColumns = []

        this.dataHeight = this.rawDataHeight = countFromDisaggregates(
            this.dimensionLookup.rows
        )
        this.dataWidth = this.rawDataWidth = countFromDisaggregates(
            this.dimensionLookup.columns
        )

        // TODO: Check last row/col dimension for size===1, skip redundant sub-totals
        this.doRowSubtotals =
            this.options.showRowSubtotals &&
            this.dimensionLookup.columns.length > 1
        this.doColumnSubtotals =
            this.options.showColumnSubtotals &&
            this.dimensionLookup.rows.length > 1

        if (this.doRowSubtotals) {
            this.dataWidth += this.dimensionLookup.columns[0].count
        }
        if (this.doColumnSubtotals) {
            this.dataHeight += this.dimensionLookup.rows[0].count
        }
        if (this.options.showRowTotals) {
            this.dataWidth += 1
        }
        if (this.options.showColumnTotals) {
            this.dataHeight += 1
        }

        this.rawData.rows.forEach(dataRow => {
            const pos = lookup(dataRow, this.dimensionLookup, this)
            this.data[pos.row] = this.data[pos.row] || []
            this.data[pos.row][pos.column] = dataRow
            this.occupiedColumns[pos.column] = true

            this.addCellValueToTotals(pos, dataRow)
        })

        this.finalizeTotals()

        this.resetRowmap()
        this.columnMap = this.options.hideEmptyColumns
            ? times(this.dataWidth, n => n).filter(
                  idx => !!this.occupiedColumns[idx]
              )
            : times(this.dataWidth, n => n)

        this.height = this.rowMap.length
        this.width = this.columnMap.length
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
        if (this.options.showRowTotals && column === this.dataWidth - 1) {
            return CELL_TYPE_TOTAL
        }
        return CELL_TYPE_VALUE
    }

    isSortable(column) {
        return (
            !this.doColumnSubtotals && this.getColumnType(column) !== undefined
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
            if (
                this.options.showColumnTotals &&
                rowA === this.rowMap.length - 1
            ) {
                return 1
            }
            if (
                this.options.showColumnTotals &&
                rowB === this.rowMap.length - 1
            ) {
                return -1
            }
            const valueA = this.getRaw({ row: rowA, column: mappedColumn })
            const valueB = this.getRaw({ row: rowB, column: mappedColumn })

            if (
                typeof valueA === 'undefined' &&
                typeof valueB === 'undefined'
            ) {
                return 0
            }
            if (typeof valueA === 'undefined') {
                return -1 * order
            }
            if (typeof valueB === 'undefined') {
                return 1 * order
            }

            return (valueA - valueB) * order
        })
    }

    clearSort() {
        this.resetRowmap()
    }
}
