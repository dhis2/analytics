import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_GROUP_ALL,
    VIS_TYPE_GROUP_CHARTS,
    VIS_TYPE_LINE_LIST,
    VIS_TYPE_PIVOT_TABLE,
} from '../../../modules/visTypes.js'
import {
    CREATED_BY_ALL,
    CREATED_BY_ALL_BUT_CURRENT_USER,
    CREATED_BY_CURRENT_USER,
} from '../CreatedByFilter.js'
import { formatFilters } from '../OpenFileDialog.js'

describe('OpenFileDialog - formatFilters', () => {
    const currentUser = { id: 'test-user' }

    const createdByTestCases = [
        [CREATED_BY_ALL, []],
        [CREATED_BY_CURRENT_USER, [`user.id:eq:${currentUser.id}`]],
        [CREATED_BY_ALL_BUT_CURRENT_USER, [`user.id:!eq:${currentUser.id}`]],
    ]

    test.each(createdByTestCases)(
        'formats the createdBy filter given %p',
        (createdBy, expected) =>
            expect(formatFilters(currentUser, { createdBy })).toEqual(expected)
    )

    test('formats the searchTerm filter', () => {
        const testSearchTerm = 'test search term'

        expect(
            formatFilters(currentUser, { searchTerm: testSearchTerm })
        ).toEqual([`identifiable:token:${testSearchTerm}`])
    })

    const typeTestCases = [
        // no type filter when no visType nor filterVisTypes
        [undefined, undefined, []],
        // no type filter because VIS_TYPE_GROUP_ALL is selected
        [undefined, VIS_TYPE_GROUP_ALL, []],
        // only VIS_TYPE_PIVOT_TABLE ignored because no filterVisTypes is passed and VIS_TYPE_GROUP_CHARTS is selected
        [
            undefined,
            VIS_TYPE_GROUP_CHARTS,
            [`type:!eq:${VIS_TYPE_PIVOT_TABLE}`],
        ],
        // no filterVisTypes and VIS_TYPE_PIVOT_TABLE selected
        [undefined, VIS_TYPE_PIVOT_TABLE, [`type:eq:${VIS_TYPE_PIVOT_TABLE}`]],
        // group types are ignored
        [
            [VIS_TYPE_PIVOT_TABLE, VIS_TYPE_GROUP_ALL, VIS_TYPE_GROUP_CHARTS],
            VIS_TYPE_GROUP_ALL,
            [`type:in:[${VIS_TYPE_PIVOT_TABLE}]`],
        ],
        // VIS_TYPE_PIVOT_TABLE is ignored because VIS_TYPE_GROUP_CHARTS is selected
        [
            [VIS_TYPE_PIVOT_TABLE, VIS_TYPE_COLUMN, VIS_TYPE_GROUP_CHARTS],
            VIS_TYPE_GROUP_CHARTS,
            [`type:in:[${VIS_TYPE_COLUMN}]`],
        ],
        // when filterVisTypes is passed the default type filter only include those
        [[VIS_TYPE_PIVOT_TABLE], '', [`type:in:[${VIS_TYPE_PIVOT_TABLE}]`]],
        [
            [VIS_TYPE_LINE_LIST, VIS_TYPE_PIVOT_TABLE],
            '',
            [`type:in:[${VIS_TYPE_LINE_LIST},${VIS_TYPE_PIVOT_TABLE}]`],
        ],
    ]

    test.each(typeTestCases)(
        'formats the type filter given %p and %p',
        (types, visType, expected) =>
            expect(
                formatFilters(
                    currentUser,
                    { visType },
                    types?.map((type) => ({
                        type,
                    }))
                )
            ).toEqual(expected)
    )

    test('combined filters', () => {
        expect(
            formatFilters(
                currentUser,
                {
                    createdBy: CREATED_BY_CURRENT_USER,
                    searchTerm: 'test',
                    visType: VIS_TYPE_GROUP_ALL,
                },
                [{ type: VIS_TYPE_LINE_LIST }, { type: VIS_TYPE_PIVOT_TABLE }]
            )
        ).toEqual([
            `identifiable:token:test`,
            `user.id:eq:${currentUser.id}`,
            `type:in:[${VIS_TYPE_LINE_LIST},${VIS_TYPE_PIVOT_TABLE}]`,
        ])
    })
})
