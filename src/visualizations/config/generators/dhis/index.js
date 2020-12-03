import getSingleValueGenerator from './singleValue'
import { VIS_TYPE_SINGLE_VALUE } from '../../../../modules/visTypes'

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
                default:
                    content = getSingleValueGenerator(
                        config,
                        node,
                        extraOptions
                    )
                    break
            }

            node.appendChild(content)

            return node.innerHTML
        }
    }
}
