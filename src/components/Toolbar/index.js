import { Aside } from './Aside.js'
import { Main } from './Main.js'
import { Sidebar } from './Sidebar.js'
import { Toolbar } from './Toolbar.js'

Toolbar.Aside = Aside
Toolbar.Main = Main
Toolbar.Sidebar = Sidebar

export * from './HoverMenuBar/index.js'
export { InterpretationsAndDetailsToggler } from './InterpretationsAndDetailsToggler.js'
export { Toolbar }
export { UpdateButton } from './UpdateButton.js'
