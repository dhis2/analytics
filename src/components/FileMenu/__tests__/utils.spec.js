import { preparePayloadForSaveAs, preparePayloadForSave } from '../utils.js'

describe('utils', () => {
    describe('preparePayloadForSaveAs', () => {
        it('removes unnecessary properties from the visualization object', () => {
            const visualization = {
                id: '123',
                created: '2023-01-01',
                createdBy: 'user1',
                user: 'user2',
                name: 'Existing Name',
                description: 'Existing Description',
                type: 'PIVOT_TABLE',
            }

            const result = preparePayloadForSaveAs({ visualization })

            expect(result).not.toHaveProperty('id')
            expect(result).not.toHaveProperty('created')
            expect(result).not.toHaveProperty('createdBy')
            expect(result).not.toHaveProperty('user')
        })

        it('sets the name to the provided name', () => {
            const visualization = { type: 'PIVOT_TABLE' }
            const name = 'New Name'

            const result = preparePayloadForSaveAs({ visualization, name })

            expect(result.name).toBe(name)
        })

        it('sets the name to the existing name if no new name is provided', () => {
            const visualization = { name: 'Existing Name', type: 'MAP' }

            const result = preparePayloadForSaveAs({ visualization })

            expect(result.name).toBe('Existing Name')
        })

        it('sets the name to a default value if no name is provided', () => {
            const visualization = { type: 'LINE_LIST' }

            const result = preparePayloadForSaveAs({ visualization })

            const expectedName = `Untitled Line list, ${new Date().toLocaleDateString(
                undefined,
                {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                }
            )}`

            expect(result.name).toBe(expectedName)
        })

        it('sets the description to the provided description', () => {
            const visualization = {
                description: 'Existing Description',
                type: 'PIVOT_TABLE',
            }
            const description = 'New Description'

            const result = preparePayloadForSaveAs({
                visualization,
                description,
            })

            expect(result.description).toBe(description)
        })

        it('keeps the existing description if no new description is provided', () => {
            const visualization = {
                description: 'Existing Description',
                type: 'PIVOT_TABLE',
            }

            const result = preparePayloadForSaveAs({ visualization })

            expect(result.description).toBe('Existing Description')
        })

        it('sets the description to undefined if no description is provided and none exists', () => {
            const visualization = { type: 'PIVOT_TABLE' }

            const result = preparePayloadForSaveAs({ visualization })

            expect(result.description).toBeUndefined()
        })
    })

    describe('preparePayloadForSave', () => {
        it('sets the name to the provided name', () => {
            const visualization = {
                id: '123',
                type: 'MAP',
                name: 'Existing name',
            }
            const name = 'New Name'

            const result = preparePayloadForSave({
                visualization,
                name,
            })

            expect(result.name).toBe(name)
        })

        it('sets the name to the existing name if no new name is provided', () => {
            const visualization = {
                id: '123',
                type: 'LINE_LIST',
                name: 'Existing Name',
            }

            const result = preparePayloadForSave({
                visualization,
            })

            expect(result.name).toBe('Existing Name')
        })

        it('sets the name to a default value if no name is provided', () => {
            const visualization = { id: '123', type: 'BAR' }

            const result = preparePayloadForSave({
                visualization,
            })

            const expectedName = `Untitled Bar, ${new Date().toLocaleDateString(
                undefined,
                {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                }
            )}`

            expect(result.name).toBe(expectedName)
        })

        it('sets the description to the provided description', () => {
            const visualization = {
                id: '123',
                type: 'YEAR_OVER_YEAR_LINE',
                description: 'Existing Description',
            }
            const description = 'New Description'

            const result = preparePayloadForSave({
                visualization,
                description,
            })

            expect(result.description).toBe(description)
        })

        it('keeps the existing description if no new description is provided', () => {
            const visualization = {
                id: '123',
                type: 'COLUMN',
                description: 'Existing Description',
            }

            const result = preparePayloadForSave({
                visualization,
            })

            expect(result.description).toBe('Existing Description')
        })

        it('sets the description to undefined if no description is provided and none exists', () => {
            const visualization = { id: '123', type: 'BAR' }

            const result = preparePayloadForSave({
                visualization,
            })

            expect(result.description).toBeUndefined()
        })
    })
})
