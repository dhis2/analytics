if (typeof globalThis.CSS === 'undefined') {
    globalThis.CSS = { supports: () => false }
} else if (typeof globalThis.CSS.supports !== 'function') {
    globalThis.CSS.supports = () => false
}
