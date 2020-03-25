import PivotTableEngineAxis from './PivotTableEngineAxis'

export class PivotTableEngineMappedAxis {
    map = []
    rawAxis

    constructor(params) {
        this.rawAxis = new PivotTableEngineAxis(params)
    }

    getHeaderStack(index) {
        const mappedIndex = this.getMappedIndex(index)
        if (mappedIndex !== undefined) {
            return this.rawAxis.getHeaderStack(mappedIndex)
        }
    }

    getMappedIndex(index) {
        return this.map[index]
    }

    // Adaptive clipping here
    get itemWidth(index) {

    }

    // Sorting here
    resetSortOrder() {
        
    }
    sort(index, direction) {

    }
}