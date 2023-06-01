import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/react'
import { shallow } from 'enzyme'
import React from 'react'
import {
    HoverMenubar,
    HoverMenuDropdown,
    HoverMenuList,
    HoverMenuListItem,
} from '../index.js'

describe('<HoverMenubar/>', () => {
    it('renders children', () => {
        const childNode = 'text node'
        const wrapper = shallow(<HoverMenubar>{childNode}</HoverMenubar>)

        expect(wrapper.containsMatchingElement(childNode)).toBe(true)
    })
    it('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        const wrapper = shallow(
            <HoverMenubar dataTest={dataTest}>children</HoverMenubar>
        )

        expect(wrapper.find('div').prop('data-test')).toBe(dataTest)
    })

    describe('mouse interactions', () => {
        it('does not open on hover before a dropdown anchor is clicked', async () => {
            createFullMenuBarWrapper()
            fireEvent.mouseOver(screen.getByText('Menu A'))

            await expectMenuItemsInDocument([
                ['Menu item A.1', false],
                ['Menu item A.2', false],
                ['Menu item A.3', false],
            ])
        })
        it('does not open when a disabled dropdown anchor is clicked', async () => {
            createFullMenuBarWrapper()
            fireEvent.click(screen.getByText('Menu C'))

            await expectMenuItemsInDocument([
                ['Menu item A.1', false],
                ['Menu item A.2', false],
                ['Menu item A.3', false],
            ])
        })
        it('opens menu list when clicked', async () => {
            createFullMenuBarWrapper()
            fireEvent.click(screen.getByText('Menu A'))

            await expectMenuItemsInDocument([
                ['Menu item A.1', true],
                ['Menu item B.1', false],
                ['Menu item C.1', false],
            ])
        })
        it('responds to hover once open', async () => {
            createFullMenuBarWrapper()
            fireEvent.click(screen.getByText('Menu A'))
            fireEvent.mouseOver(screen.getByText('Menu B'))

            await expectMenuItemsInDocument([
                ['Menu item A.1', false],
                ['Menu item B.1', true],
                ['Menu item C.1', false],
            ])
        })
        it('does not open disabled dropdown on hover in hover mode', async () => {
            createFullMenuBarWrapper()
            fireEvent.click(screen.getByText('Menu B'))
            fireEvent.mouseOver(screen.getByText('Menu C'))

            await expectMenuItemsInDocument([
                ['Menu item B.1', true],
                ['Menu item C.1', false],
            ])
        })
        it('opens submenus when in hover mode', async () => {
            createFullMenuBarWrapper()
            fireEvent.click(screen.getByText('Menu B'))
            fireEvent.mouseOver(screen.getByText('Menu item B.1'))

            await expectMenuItemsInDocument([
                ['Menu item B.1.1', true],
                ['Menu item B.1.2', true],
                ['Menu item B.1.3', true],
                ['Menu item B.2.1', false],
                ['Menu item B.2.2', false],
                ['Menu item B.2.3', false],
            ])

            fireEvent.mouseOver(screen.getByText('Menu item B.2'))

            await expectMenuItemsInDocument([
                ['Menu item B.1.1', false],
                ['Menu item B.1.2', false],
                ['Menu item B.1.3', false],
                ['Menu item B.2.1', true],
                ['Menu item B.2.2', true],
                ['Menu item B.2.3', true],
            ])
        })
        it('does not open disabled submenus when in hover mode', async () => {
            createFullMenuBarWrapper()
            fireEvent.click(screen.getByText('Menu B'))
            fireEvent.mouseOver(screen.getByText('Menu item B.2'))

            await expectMenuItemsInDocument([
                ['Menu item B.2.1', true],
                ['Menu item B.2.2', true],
                ['Menu item B.2.3', true],
                ['Menu item B.3.1', false],
                ['Menu item B.3.2', false],
                ['Menu item B.3.3', false],
            ])

            fireEvent.mouseOver(screen.getByText('Menu item B.3'))

            await expectMenuItemsInDocument([
                ['Menu item B.2.1', true],
                ['Menu item B.2.2', true],
                ['Menu item B.2.3', true],
                ['Menu item B.3.1', false],
                ['Menu item B.3.2', false],
                ['Menu item B.3.3', false],
            ])
        })
        it('closes when clicking on then document', async () => {
            createFullMenuBarWrapper()
            fireEvent.click(screen.getByText('Menu A'))

            await expectMenuItemsInDocument([['Menu item A.1', true]])

            fireEvent.click(document)

            await expectMenuItemsInDocument([['Menu item A.1', false]])
        })
        it('stays open when clicking a open submenu anchor', async () => {
            createFullMenuBarWrapper()
            fireEvent.click(screen.getByText('Menu B'))

            await expectMenuItemsInDocument([['Menu item B.1', true]])

            fireEvent.mouseOver(screen.getByText('Menu item B.1'))

            await expectMenuItemsInDocument([
                ['Menu item B.1', true],
                ['Menu item B.1.1', true],
                ['Menu item B.1.2', true],
                ['Menu item B.1.3', true],
            ])

            fireEvent.click(screen.getByText('Menu item B.1'))

            await expectMenuItemsInDocument([
                ['Menu item B.1', true],
                ['Menu item B.1.1', true],
                ['Menu item B.1.2', true],
                ['Menu item B.1.3', true],
            ])
        })
        it('calls the onClick of the menu item and closes when clicking a menu item', async () => {
            const menuItemOnClickSpy = jest.fn()
            createFullMenuBarWrapper({ menuItemOnClickSpy })
            fireEvent.click(screen.getByText('Menu A'))

            await expectMenuItemsInDocument([['Menu item A.1', true]])

            fireEvent.click(screen.getByText('Menu item A.1'))

            expect(menuItemOnClickSpy).toHaveBeenCalledTimes(1)
            await expectMenuItemsInDocument([['Menu item A.1', false]])
        })

        it('calls the onClick of the menu item and closes when clicking a submenu item', async () => {
            const subMenuItemOnClickSpy = jest.fn()
            createFullMenuBarWrapper({ subMenuItemOnClickSpy })

            fireEvent.click(screen.getByText('Menu B'))
            await expectMenuItemsInDocument([['Menu item B.1', true]])

            fireEvent.mouseOver(screen.getByText('Menu item B.1'))
            await expectMenuItemsInDocument([['Menu item B.1.1', true]])

            fireEvent.click(screen.getByText('Menu item B.1.1'))

            expect(subMenuItemOnClickSpy).toHaveBeenCalledTimes(1)
            await expectMenuItemsInDocument([
                ['Menu item B.1', false],
                ['Menu item B.1.1', false],
                ['Menu item B.1.1', false],
            ])
        })
    })
})

function createFullMenuBarWrapper({
    menuItemOnClickSpy,
    subMenuItemOnClickSpy,
} = {}) {
    return render(
        <HoverMenubar>
            <HoverMenuDropdown label="Menu A">
                <HoverMenuList>
                    <HoverMenuListItem
                        label="Menu item A.1"
                        onClick={menuItemOnClickSpy}
                    />
                    <HoverMenuListItem label="Menu item A.2" />
                    <HoverMenuListItem label="Menu item A.3" />
                </HoverMenuList>
            </HoverMenuDropdown>
            <HoverMenuDropdown label="Menu B">
                <HoverMenuList>
                    <HoverMenuListItem label="Menu item B.1">
                        <HoverMenuListItem
                            label="Menu item B.1.1"
                            onClick={subMenuItemOnClickSpy}
                        />
                        <HoverMenuListItem label="Menu item B.1.2" />
                        <HoverMenuListItem label="Menu item B.1.3" />
                    </HoverMenuListItem>
                    <HoverMenuListItem label="Menu item B.2">
                        <HoverMenuListItem label="Menu item B.2.1" />
                        <HoverMenuListItem label="Menu item B.2.2" />
                        <HoverMenuListItem label="Menu item B.2.3" />
                    </HoverMenuListItem>
                    <HoverMenuListItem label="Menu item B.3" disabled>
                        <HoverMenuListItem label="Menu item B.3.1" />
                        <HoverMenuListItem label="Menu item B.3.2" />
                        <HoverMenuListItem label="Menu item B.3.3" />
                    </HoverMenuListItem>
                </HoverMenuList>
            </HoverMenuDropdown>
            <HoverMenuDropdown label="Menu C" disabled>
                <HoverMenuList>
                    <HoverMenuListItem label="Menu item C.1" />
                    <HoverMenuListItem label="Menu item C.2" />
                    <HoverMenuListItem label="Menu item C.3" />
                </HoverMenuList>
            </HoverMenuDropdown>
        </HoverMenubar>
    )
}

async function expectMenuItemsInDocument(items) {
    for (const [text, inDocument] of items) {
        if (inDocument) {
            expect(await screen.findByText(text)).toBeInTheDocument()
        } else {
            expect(screen.queryByText(text)).not.toBeInTheDocument()
        }
    }
}
