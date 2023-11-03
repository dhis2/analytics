import H from 'highcharts'
import HPF from 'highcharts/modules/pattern-fill'

HPF(H)

export const COLOR_SET_DEFAULT = 'DEFAULT'
export const COLOR_SET_BASIC = 'BASIC'
export const COLOR_SET_EXTENDED = 'EXTENDED'
export const COLOR_SET_BRIGHT = 'BRIGHT'
export const COLOR_SET_DARK = 'DARK'
export const COLOR_SET_GRAY = 'GRAY'
export const COLOR_SET_COLOR_BLIND = 'COLOR_BLIND'
export const COLOR_SET_PATTERNS = 'PATTERNS'

export const colorSets = {
    [COLOR_SET_DEFAULT]: {
        colors: [
            '#a8bf24',
            '#518cc3',
            '#d74554',
            '#ff9e21',
            '#968f8f',
            '#ba3ba1',
            '#ffda54',
            '#45beae',
            '#b98037',
            '#676767',
            '#6b2dd4',
            '#47792c',
            '#fcbdbd',
            '#830000',
            '#a5ffc0',
            '#000078',
            '#817c00',
            '#bdf023',
            '#fffac4',
        ],
    },
    [COLOR_SET_BASIC]: {
        colors: [
            '#348F41',
            '#9F2241',
            '#B4A269',
            '#EBEEF3',
            '#58595B',
            '#1A5632',
        ],
    },
    [COLOR_SET_EXTENDED]: {
        colors: [
            '#194F90',
            '#AE1857',
            '#5B7E96',
            '#FFB71B',
            '#1DCAD3',
            '#FF5C35',
            '#8F4899',
            '#DAE343',
            '#385CAD',
            '#E81F76',
            '#009383',
            '#522B39',
        ],
    },
    [COLOR_SET_BRIGHT]: {
        colors: [
            '#fd7f6f',
            '#8bd3c7',
            '#beb9db',
            '#7eb0d5',
            '#ffb55a',
            '#fdcce5',
            '#ffffaf',
            '#d9d9d9',
            '#bd7ebe',
            '#cbecc4',
            '#9fe778',
            '#ffef65',
        ],
    },
    [COLOR_SET_DARK]: {
        colors: [
            '#115688',
            '#207718',
            '#b51208',
            '#803d00',
            '#5e338a',
            '#078a7f',
            '#56a2cd',
            '#73b62f',
            '#db0606',
            '#e68a00',
            '#9e6fb3',
            '#aaad00',
        ],
    },
    [COLOR_SET_GRAY]: {
        colors: ['#cfcfcf', '#8f8782', '#414451', '#a5acaf', '#60636a'],
    },
    [COLOR_SET_COLOR_BLIND]: {
        colors: [
            '#cfcfcf',
            '#ffbc79',
            '#a2c8ec',
            '#898989',
            '#c85200',
            '#5f9ed1',
            '#595959',
            '#ababab',
            '#ff800e',
            '#006ba4',
        ],
    },
    [COLOR_SET_PATTERNS]: {
        patterns: H.patterns,
    },
}
