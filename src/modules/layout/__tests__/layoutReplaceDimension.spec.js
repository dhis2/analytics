import { layoutReplaceDimension } from '../layoutReplaceDimension'
import { TEST_LAYOUT, TEST_DIMENSION_4 } from '../testResources'
import { DIMENSION_ID_ORGUNIT } from '../../fixedDimensions'

const newOuDimensions = [
    {
        name: 'bob',
        occupation: 'the builder',
    },
]

describe('layoutReplaceDimension', () => {
    it('replaces the dimension in the provided layout', () => {
        const updatedLayout = layoutReplaceDimension(
            TEST_LAYOUT,
            DIMENSION_ID_ORGUNIT,
            newOuDimensions
        )

        expect(updatedLayout.filters).toMatchObject([
            { dimension: 'ou', items: newOuDimensions },
            TEST_DIMENSION_4,
        ])
    })
})
