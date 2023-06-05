import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import {
    HoverMenuBar,
    HoverMenuDropdown,
    HoverMenuList,
    HoverMenuListItem,
    InterpretationsAndDetailsToggler,
    Toolbar,
    ToolbarSidebar,
    UpdateButton,
} from '../components/Toolbar/index.js'

function HoverMenuBarWithSubComponents() {
    const [isHidden, setIsHidden] = useState(false)
    const [isSidebarShowing, setIsSidebarShowing] = useState(false)
    return (
        <Toolbar>
            <ToolbarSidebar isHidden={isHidden}>
                <span>Toolbar side bar</span>
                <a
                    style={{
                        paddingLeft: 12,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }}
                    onClick={() => setIsHidden(true)}
                >
                    click to hide
                </a>
            </ToolbarSidebar>
            <UpdateButton />
            <HoverMenuBar>
                <HoverMenuDropdown label="Menu A">
                    <HoverMenuList>
                        <HoverMenuListItem label="Menu item A.1" />
                        <HoverMenuListItem label="Menu item A.2" />
                        <HoverMenuListItem label="Menu item A.3" />
                    </HoverMenuList>
                </HoverMenuDropdown>
                <HoverMenuDropdown label="Menu B">
                    <HoverMenuList>
                        <HoverMenuListItem label="Menu item B.1">
                            <HoverMenuListItem label="Menu item B.1.1" />
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
            <InterpretationsAndDetailsToggler
                isShowing={isSidebarShowing}
                onClick={() => setIsSidebarShowing((current) => !current)}
            />
        </Toolbar>
    )
}

storiesOf('HoverMenuBar', module).add('default', () => {
    return <HoverMenuBarWithSubComponents />
})
