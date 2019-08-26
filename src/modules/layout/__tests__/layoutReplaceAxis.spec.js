import { layoutReplaceAxis } from '../layoutReplaceAxis'
import { TEST_LAYOUT, TEST_DIMENSION_4 } from '../testResources'
import { AXIS_NAME_COLUMNS } from '../axis'

const newAxisDimensions = [
    ({ dimension: 'ou', items: {} }, { dimension: 'dynamicUid', items: {} }),
]

describe('layoutReplaceAxis', () => {
    it('replaces the column axis in the provided layout', () => {
        const updatedLayout = layoutReplaceAxis(
            TEST_LAYOUT,
            AXIS_NAME_COLUMNS,
            newAxisDimensions
        )

        expect(updatedLayout.columns).toMatchObject(newAxisDimensions)
    })

    it('returns unchanged layout if axis not valid', () => {
        const updatedLayout = layoutReplaceAxis(
            TEST_LAYOUT,
            'non-existing-axis',
            newAxisDimensions
        )

        expect(updatedLayout).toMatchObject(TEST_LAYOUT)
    })
})
