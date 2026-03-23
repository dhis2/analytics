if (global.CSS === undefined) {
    global.CSS = { supports: () => false }
} else if (typeof global.CSS.supports !== 'function') {
    global.CSS.supports = () => false
}
