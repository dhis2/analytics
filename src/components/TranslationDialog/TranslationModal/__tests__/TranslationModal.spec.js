import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { TranslationModal } from '../TranslationModal.js'

const mockUseTranslationResults = jest.fn(() => ({
    translationsData: undefined,
    fetching: false,
}))

jest.mock('../useTranslationsResults.js', () => ({
    useTranslationsResults: (args) => mockUseTranslationResults(args),
}))

describe('TranslationDialog component', () => {
    let props

    const onClose = jest.fn()
    const onTranslationSaved = jest.fn()

    const renderTranslationModalComponent = (props) => {
        return render(
            <CustomDataProvider
                data={{
                    i18n: { name: 'Name', description: 'Description' },
                    'locales/db': [
                        {
                            locale: 'en',
                            name: 'English',
                            displayName: 'English',
                        },
                    ],
                }}
            >
                <TranslationModal {...props} />
            </CustomDataProvider>
        )
    }

    beforeEach(() => {
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

    test('renders a Modal component', () => {
        renderTranslationModalComponent(props)

        expect(
            screen.getByTestId('dhis2-analytics-translation-modal')
        ).toBeInTheDocument()
    })

    test("renders a ModalTitle containing the object's name", () => {
        renderTranslationModalComponent(props)
        expect(
            screen.getByText(`Translate: ${props.objectToTranslate.name}`)
        ).toBeInTheDocument()
    })

    test.each([
        'https://dhis2.tld/path/api/visualization/object-id',
        'https://dhis2.tld/path/api/42/visualization/object-id',
    ])('uses the correct resource for the translation endpoint', (href) => {
        props.objectToTranslate.href = href

        renderTranslationModalComponent(props)

        expect(mockUseTranslationResults).toHaveBeenCalled()
        expect(mockUseTranslationResults).toHaveBeenCalledWith({
            resource: 'visualization/object-id',
        })
    })
})
