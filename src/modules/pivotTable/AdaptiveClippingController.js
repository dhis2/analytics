import { measureTextWithWrapping } from './measureText'
import {
    CLIPPED_AXIS_PARTITION_SIZE_PX,
    CLIPPED_CELL_MIN_SIZE,
} from './pivotTableConstants'

export class AdaptiveClippingController {
    columns
    rows
    engine

    constructor(engine) {
        this.engine = engine
        this.reset()
    }

    addSize({ row, column }, { width, height }) {
        if (column >= 0) {
            const columnSize = this.columns.sizes[column] || {
                pre: 0,
                size: 0,
            }
            columnSize.size = Math.max(columnSize.size, width)
            this.columns.sizes[column] = columnSize
        } else {
            const index = this.engine.rowDepth + column
            this.columns.headerSizes[index] = Math.max(
                this.columns.headerSizes[index] || 0,
                width
            )
        }

        if (row >= 0) {
            const rowSize = this.rows.sizes[row] || {
                pre: 0,
                size: 0,
            }
            rowSize.size = Math.max(rowSize.size, height)
            this.rows.sizes[row] = rowSize
        } else {
            const index = this.engine.columnDepth + row
            this.rows.headerSizes[index] = Math.max(
                this.rows.headerSizes[index] || 0,
                height
            )
        }
    }

    add({ row, column }, renderedValue) {
        this.addSize({ row, column }, this.measureText(renderedValue))
    }

    measureText(renderedValue, options = {}) {
        return measureTextWithWrapping(renderedValue, {
            fontSize: this.engine.fontSize,
            ...options,
        })
    }

    getCellSize(contentSize) {
        return (
            Math.ceil(contentSize) + this.engine.cellPadding * 2 + /*border*/ 2
        )
    }

    finalizeAxis(axis) {
        axis.headerSize = 0

        const isColumn = axis.orientation === 'column'

        const map = isColumn ? this.engine.columnMap : this.engine.rowMap
        const getHeader = index =>
            isColumn
                ? this.engine.getRawColumnHeader(index)
                : this.engine.getRawRowHeader(index)

        map.forEach((index, mapIndex) => {
            const headerStack = getHeader(index)
            headerStack.forEach((header, level) => {
                const label =
                    this.engine.visualization.showHierarchy && header?.hierarchy
                        ? header.hierarchy.join(' / ')
                        : header?.name

                if (label) {
                    const isLeafHeader = level === headerStack.length - 1
                    if (isColumn) {
                        const headerSize = this.measureText(label, {
                            maxWidth: isLeafHeader
                                ? Math.max(
                                      CLIPPED_CELL_MIN_SIZE,
                                      axis.sizes[index]?.size || 0
                                  )
                                : 0,
                        })
                        this.addSize(
                            { row: -headerStack.length + level, column: index },
                            {
                                height: headerSize.height,
                                width: isLeafHeader
                                    ? headerSize.width +
                                      (this.engine.isSortable(mapIndex)
                                          ? this.engine.scrollIconBuffer
                                          : 0)
                                    : 0,
                            }
                        )
                    } else {
                        const headerSize = this.measureText(label, {})
                        this.addSize(
                            { row: index, column: -headerStack.length + level },
                            {
                                height: isLeafHeader ? headerSize.height : 0,
                                width: headerSize.width,
                            }
                        )
                    }
                }
            })

            axis.sizes[index] = {
                pre: 0,
                size: this.getCellSize(axis.sizes[index]?.size),
            }
        })

        this.populateAxisPartitions(axis)
    }

    populateAxisPartitions(axis) {
        axis.totalSize = 0
        axis.partitions = []
        let nextPartitionPx = 0

        const isColumn = axis.orientation === 'column'
        const map = isColumn ? this.engine.columnMap : this.engine.rowMap
        map.forEach((index, mapIndex) => {
            if (axis.totalSize >= nextPartitionPx) {
                axis.partitions.push(mapIndex)
                nextPartitionPx += CLIPPED_AXIS_PARTITION_SIZE_PX
            }
            axis.sizes[index].pre = axis.totalSize
            axis.totalSize += axis.sizes[index].size
        })
    }

    finalize() {
        if (this.engine.visualization.showDimensionLabels) {
            const columnDimensionCount =
                this.engine.dimensionLookup.columnHeaders.length
            const rowDimensionCount =
                this.engine.dimensionLookup.rowHeaders.length
            this.engine.dimensionLookup.columnHeaders.forEach(
                (_, columnLevel) => {
                    this.engine.dimensionLookup.rowHeaders.forEach(
                        (_, rowLevel) => {
                            const label = this.engine.getDimensionLabel(
                                rowLevel,
                                columnLevel
                            )
                            if (label) {
                                this.add(
                                    {
                                        row: -rowDimensionCount + rowLevel,
                                        column:
                                            -columnDimensionCount + columnLevel,
                                    },
                                    label
                                )
                            }
                        }
                    )
                }
            )
        }

        this.finalizeAxis(this.columns)
        this.finalizeAxis(this.rows)

        this.columns.headerSize = 0
        this.columns.headerSizes = this.columns.headerSizes.map(size => {
            const paddedSize = this.getCellSize(size)
            this.columns.headerSize += paddedSize
            return paddedSize
        })

        this.rows.headerSize = 0
        this.rows.headerSizes = this.rows.headerSizes.map(size => {
            const paddedSize = this.getCellSize(size)
            this.rows.headerSize += paddedSize
            return paddedSize
        })
    }

    reset() {
        this.columns = {
            orientation: 'column',
            totalSize: 0,
            headerSize: 0,
            sizes: [],
            partitions: [],
            headerSizes: [],
        }
        this.rows = {
            orientation: 'row',
            totalSize: 0,
            headerSize: 0,
            sizes: [],
            partitions: [],
            headerSizes: [],
        }
    }
}
