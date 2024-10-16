import nonASCIIFontBugfix from './nonASCIIFont.js'
import textShadowBugFix from './textShadow.js'

export default function (H) {
    textShadowBugFix(H)
    nonASCIIFontBugfix(H)
}
