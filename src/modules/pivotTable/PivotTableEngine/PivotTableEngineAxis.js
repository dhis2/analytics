

export class PivotTableEngineAxis {
    dataSize = 0
    size = 0
    headerDepth = 0
    dimensionDepth = 0
    
    showSubtotals = false
    showTotals = false

    dimensions
    
    constructor({ dimensions, showSubtotals, showTotals, showEmptyHeader, sortable }) {
        this.dimensionDepth = dimensions.length

        this.dimensions = dimensions
        this.dataSize = this.size = countFromDisaggregates(dimensions)

        this.showSubtotals = showSubtotals && this.dimensionDepth > 1
        this.showTotals = showTotals && this.dataSize > 1

        if (this.showSubtotals) {
            this.size += dimensions[0].count
        }

        if (this.showTotals) {
            this.size += 1
        }
    }

    isSubtotal(index) {
        return this.showSubtotals && (index + 1) % (this.dimensions[0].size + 1) === 0
    }
    isTotal(index) {
        return this.showTotals && index === this.size - 1
    }

    getDataIndex(index) {
        return this.showSubtotals ? index - Math.floor(index / (this.dimensions[0].size + 1)) : index
    }

    getHeaderStack(index) {
        if (this.isTotal(index)) {
            return times(this.dimensionDepth - 1, () => undefined).concat([
                { name: 'Total' },
            ])
        }
        
        if (this.isSubtotal(index)) {
            return times(this.dimensionDepth - 1, () => undefined).concat([
                { name: 'Subtotal' },
            ])
        }
        
        row = this.getIndexWithoutSubtotals(index)

        return this.dimensions.map(dimension => {
            const itemIndex = Math.floor(item / dimension.size) % dimension.count
            return dimension.items[itemIndex]
        })
    }
}