import { ModalTitle, Modal } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { TranslationModal } from '../TranslationModal.js'

const mockUseTranslationResults = jest.fn(() => ({
    translationsData: undefined,
    fetching: false,
}))

jest.mock('../useTranslationsResults.js', () => ({
    useTranslationsResults: (args) => mockUseTranslationResults(args),
}))

describe('The Translation Dialog component', () => {
    let shallowTranslationModal
    let props

    const onClose = jest.fn()
    const onTranslationSaved = jest.fn()

    const getTranslationModalComponent = (props) => {
        if (!shallowTranslationModal) {
            shallowTranslationModal = shallow(<TranslationModal {...props} />)
        }
        return shallowTranslationModal
    }

    beforeEach(() => {
        shallowTranslationModal = undefined
        props = {
            fieldsToTranslate: ['name', 'description'],
            objectToTranslate: {
                name: 'Test object',
                href: 'https://dhis2.tld/path/api/visualization/object-id',
            },
            onClose,
            onTranslationSaved,
        }
    })

    it('renders a Modal component', () => {
        expect(getTranslationModalComponent(props).find(Modal)).toHaveLength(1)
    })

    it("renders a ModalTitle containing the object's name", () => {
        expect(
            getTranslationModalComponent(props)
                .find(ModalTitle)
                .childAt(0)
                .text()
        ).toEqual(`Translate: ${props.objectToTranslate.name}`)
    })

    test.each([
        'https://dhis2.tld/path/api/visualization/object-id',
        'https://dhis2.tld/path/api/42/visualization/object-id',
    ])('uses the correct resource for the translation endpoint', (href) => {
        props.objectToTranslate.href = href

        getTranslationModalComponent(props)

        expect(mockUseTranslationResults).toHaveBeenCalled()
        expect(mockUseTranslationResults).toHaveBeenCalledWith({
            resource: 'visualization/object-id',
        })
    })
})
