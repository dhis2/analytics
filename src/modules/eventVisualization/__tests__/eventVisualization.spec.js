import { transformEventVisualization } from "../eventVisualization"

const testDim1 = {
    dimension: 'eventDate',
    programStage: {
        id: 'A03MvHHogjR'
    }
}

const testDim2 = {
    dimension: 'enrollmentDate',
    program: {
        id: 'IpHINAT79UW'
    }
}

const testDim3 = {
    dimension: 'created'
}

const testAxis = [
    testDim1
]

const testVis = {
    columns: testAxis,
    rows: [testDim2],
    filters: [testDim3],
}

describe('eventVisualization', () => {
    describe('transformEventVisualization', () => {
        it('does not modify dimension, axis or vis', () => {
            const newVis = transformEventVisualization(testVis)
            expect(newVis === testVis).toBe(false)
            expect(newVis.columns === testAxis).toBe(false)
            expect(newVis.columns[0] === testDim1).toBe(false)
        })

        it('applies program stage to id', () => {
            const newVis = transformEventVisualization(testVis)
            expect(newVis.columns[0].dimension).toBe('A03MvHHogjR.eventdate')
        })

        it('applies program to id', () => {
            const newVis = transformEventVisualization(testVis)
            expect(newVis.rows[0].dimension).toBe('IpHINAT79UW.enrollmentdate')
        })
    })
})