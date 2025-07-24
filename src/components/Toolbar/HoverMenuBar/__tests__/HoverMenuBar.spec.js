import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {
    HoverMenuBar,
    HoverMenuDropdown,
    HoverMenuList,
    HoverMenuListItem,
} from '../index.js'

describe('<HoverMenuBar/>', () => {
    test('renders children', () => {
        const childNode = 'text node'
        render(<HoverMenuBar>{childNode}</HoverMenuBar>)

        expect(screen.getByText(childNode)).toBeInTheDocument()
    })

    test('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        render(<HoverMenuBar dataTest={dataTest}>children</HoverMenuBar>)

        expect(screen.getByTestId(dataTest)).toBeInTheDocument()
    })

    describe('mouse interactions', () => {
        test('does not open on hover before a dropdown anchor is clicked', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.hover(screen.getByText('Menu A'))

            await expectMenuItemsInDocument([
                ['Menu item A.1', false],
                ['Menu item A.2', false],
                ['Menu item A.3', false],
            ])
        })

        test('does not open when a disabled dropdown anchor is clicked', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.click(screen.getByText('Menu C'))

            await expectMenuItemsInDocument([
                ['Menu item A.1', false],
                ['Menu item A.2', false],
                ['Menu item A.3', false],
            ])
        })

        test('opens menu list when clicked', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.click(screen.getByText('Menu A'))

            await expectMenuItemsInDocument([
                ['Menu item A.1', true],
                ['Menu item B.1', false],
                ['Menu item C.1', false],
            ])
        })

        test('responds to hover once open', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.click(screen.getByText('Menu A'))
            await user.hover(screen.getByText('Menu B'))

            await expectMenuItemsInDocument([
                ['Menu item A.1', false],
                ['Menu item B.1', true],
                ['Menu item C.1', false],
            ])
        })

        test('does not open disabled dropdown on hover in hover mode', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.click(screen.getByText('Menu B'))
            await user.hover(screen.getByText('Menu C'))

            await expectMenuItemsInDocument([
                ['Menu item B.1', true],
                ['Menu item C.1', false],
            ])
        })

        test('opens submenus when in hover mode', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.click(screen.getByText('Menu B'))
            await user.hover(screen.getByText('Menu item B.1'))

            await expectMenuItemsInDocument([
                ['Menu item B.1.1', true],
                ['Menu item B.1.2', true],
                ['Menu item B.1.3', true],
                ['Menu item B.2.1', false],
                ['Menu item B.2.2', false],
                ['Menu item B.2.3', false],
            ])

            await user.hover(screen.getByText('Menu item B.2'))

            await expectMenuItemsInDocument([
                ['Menu item B.1.1', false],
                ['Menu item B.1.2', false],
                ['Menu item B.1.3', false],
                ['Menu item B.2.1', true],
                ['Menu item B.2.2', true],
                ['Menu item B.2.3', true],
            ])
        })

        test('does not open disabled submenus when in hover mode', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.click(screen.getByText('Menu B'))
            await user.hover(screen.getByText('Menu item B.2'))

            await expectMenuItemsInDocument([
                ['Menu item B.2.1', true],
                ['Menu item B.2.2', true],
                ['Menu item B.2.3', true],
                ['Menu item B.3.1', false],
                ['Menu item B.3.2', false],
                ['Menu item B.3.3', false],
            ])

            await user.hover(screen.getByText('Menu item B.3'))

            await expectMenuItemsInDocument([
                ['Menu item B.2.1', true],
                ['Menu item B.2.2', true],
                ['Menu item B.2.3', true],
                ['Menu item B.3.1', false],
                ['Menu item B.3.2', false],
                ['Menu item B.3.3', false],
            ])
        })

        test('closes when clicking on then document', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.click(screen.getByText('Menu A'))

            await expectMenuItemsInDocument([['Menu item A.1', true]])

            await user.click(document.body)

            await expectMenuItemsInDocument([['Menu item A.1', false]])
        })

        test('stays open when clicking a open submenu anchor', async () => {
            const user = userEvent.setup()

            createFullMenuBarWrapper()

            await user.click(screen.getByText('Menu B'))

            await expectMenuItemsInDocument([['Menu item B.1', true]])

            await user.hover(screen.getByText('Menu item B.1'))

            await expectMenuItemsInDocument([
                ['Menu item B.1', true],
                ['Menu item B.1.1', true],
                ['Menu item B.1.2', true],
                ['Menu item B.1.3', true],
            ])

            await user.click(screen.getByText('Menu item B.1'))

            await expectMenuItemsInDocument([
                ['Menu item B.1', true],
                ['Menu item B.1.1', true],
                ['Menu item B.1.2', true],
                ['Menu item B.1.3', true],
            ])
        })

        test('calls the onClick of the menu item and closes when clicking a menu item', async () => {
            const user = userEvent.setup()
            const menuItemOnClickSpy = jest.fn()

            createFullMenuBarWrapper({ menuItemOnClickSpy })

            await user.click(screen.getByText('Menu A'))

            await expectMenuItemsInDocument([['Menu item A.1', true]])

            await user.click(screen.getByText('Menu item A.1'))

            expect(menuItemOnClickSpy).toHaveBeenCalledTimes(1)
            await expectMenuItemsInDocument([['Menu item A.1', false]])
        })

        test('calls the onClick of the menu item and closes when clicking a submenu item', async () => {
            const user = userEvent.setup()
            const subMenuItemOnClickSpy = jest.fn()

            createFullMenuBarWrapper({ subMenuItemOnClickSpy })

            await user.click(screen.getByText('Menu B'))
            await expectMenuItemsInDocument([['Menu item B.1', true]])

            await user.hover(screen.getByText('Menu item B.1'))
            await expectMenuItemsInDocument([['Menu item B.1.1', true]])

            await user.click(screen.getByText('Menu item B.1.1'))

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
        <HoverMenuBar>
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
        </HoverMenuBar>
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
