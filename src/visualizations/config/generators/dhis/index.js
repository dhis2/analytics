import { VISUALIZATION_TYPE_SINGLE_VALUE } from '../../adapters/dhis_dhis/type'
import getSingleValueGenerator from './singleValue'

export default function(config, parentEl) {
    if (config) {
        const node =
            typeof parentEl === 'object'
                ? parentEl
                : typeof parentEl === 'string'
                ? document.querySelector(parentEl)
                : null

        if (node) {
            if (node.lastChild) {
                node.removeChild(node.lastChild)
            }

            let content

            switch (config.type) {
                case VISUALIZATION_TYPE_SINGLE_VALUE:
                    content = getSingleValueGenerator(config, node)
                    break
                default:
                    content = getSingleValueGenerator(config, node)
            }

            node.appendChild(content)

            return node.innerHTML
        }
    }
}
