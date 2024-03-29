import { DIMENSION_ID_ORGUNIT } from '../../predefinedDimensions.js'
import { layoutReplaceDimension } from '../layoutReplaceDimension.js'
import { TEST_LAYOUT, TEST_DIMENSION_4 } from '../testResources.js'

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

    it('returns layout unchanged if dimension not found', () => {
        const updatedLayout = layoutReplaceDimension(
            TEST_LAYOUT,
            'non-existing-dimension',
            newOuDimensions
        )

        expect(updatedLayout).toMatchObject(TEST_LAYOUT)
    })
})
