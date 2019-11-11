import { VIS_TYPE_SINGLE_VALUE } from '../../adapters/dhis_dhis/type'
import getSingleValueGenerator from './singleValue'

export default function(config, parentEl, extraOptions) {
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
                case VIS_TYPE_SINGLE_VALUE:
                    content = getSingleValueGenerator(
                        config,
                        node,
                        extraOptions
                    )
                    break
                default:
                    content = getSingleValueGenerator(
                        config,
                        node,
                        extraOptions
                    )
            }

            node.appendChild(content)

            return node.innerHTML
        }
    }
}
