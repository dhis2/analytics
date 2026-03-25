/* eslint-disable no-undef */
if (globalThis.CSS === undefined) {
    globalThis.CSS = { supports: () => true }
} else if (typeof globalThis.CSS.supports !== 'function') {
    globalThis.CSS.supports = () => true
}
