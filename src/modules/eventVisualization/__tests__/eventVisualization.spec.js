import { transformEventVisualization } from '../eventVisualization.js'

const testDim1 = {
    dimension: 'eventDate',
    programStage: {
        id: 'A03MvHHogjR',
    },
}

const testDim2 = {
    dimension: 'enrollmentDate',
    program: {
        id: 'IpHINAT79UW',
    },
}

const testDim3 = {
    dimension: 'created',
}

const testAxis = [testDim1]

const testVis = {
    columns: testAxis,
    rows: [testDim2],
    filters: [testDim3],
}

describe('eventVisualization', () => {
    describe('transformEventVisualization', () => {
        it('does not modify dimension, axis or vis', () => {
            const newVis = transformEventVisualization(testVis)
            expect(newVis).not.toBe(testVis)
            expect(newVis.columns).not.toBe(testAxis)
            expect(newVis.columns[0]).not.toBe(testDim1)
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
