import { getColorByValueFromLegendSet } from '../legends.js'

const positiveLegendSet = {
    legends: [
        {
            startValue: 65,
            endValue: 75,
            color: '#2171b5',
            id: 'ZuBlFGK8U7D',
            name: '65 - 74',
        },
        {
            startValue: 35,
            endValue: 45,
            color: '#9ecae1',
            id: 'XTmLeJHmd3m',
            name: '35 - 44',
        },
        {
            startValue: 75,
            endValue: 85,
            color: '#08519c',
            id: 'VPEprgLdi1g',
            name: '75 - 84',
        },
        {
            startValue: 25,
            endValue: 35,
            color: '#c6dbef',
            id: 'CqUnYcUy2eb',
            name: '25 - 34',
        },
        {
            startValue: 15,
            endValue: 25,
            color: '#deebf7',
            id: 'evLlhbRsG6e',
            name: '15 - 24',
        },
        {
            startValue: 0,
            endValue: 5,
            color: '#FFFFFF',
            id: 'GHcJ24t8oEs',
            name: '0 - 4',
        },
        {
            startValue: 85,
            endValue: 150,
            color: '#08306b',
            id: 'dPFk7tcCg7U',
            name: '85+',
        },
        {
            startValue: 45,
            endValue: 55,
            color: '#6baed6',
            id: 'uHBR7cbKoy3',
            name: '45 - 54',
        },
        {
            startValue: 5,
            endValue: 15,
            color: '#f7fbff',
            id: 'RUD8IwOsXEW',
            name: '5 - 14',
        },
        {
            startValue: 55,
            endValue: 65,
            color: '#4292c6',
            id: 'UojF9VGBvnE',
            name: '55 - 64',
        },
    ],
    name: 'Positive',
}

const negativeLegendSet = {
    legends: [
        {
            startValue: -48,
            endValue: -36,
            color: '#fecc5c',
            id: 'TR60hS8mQag',
            name: '-48 - -36',
        },
        {
            startValue: -1000,
            endValue: -60,
            color: '#D10AFF',
            id: 'nxCTJlHd9V2',
            name: 'Critically low',
        },
        {
            startValue: -24,
            endValue: -12,
            color: '#f03b20',
            id: 'JOYfGUtyLJF',
            name: '-24 - -12',
        },
        {
            startValue: -60,
            endValue: -48,
            color: '#ffffb2',
            id: 'JodoDUR31ig',
            name: '-60 - -48',
        },
        {
            startValue: -12,
            endValue: 0,
            color: '#bd0026',
            id: 'rFFEKuATWaZ',
            name: '-12 - 0',
        },
        {
            startValue: 0,
            endValue: 10000,
            color: '#A3A3A3',
            id: 'rOD16kf9YzA',
            name: 'Out of bounds',
        },
        {
            startValue: -36,
            endValue: -24,
            color: '#fd8d3c',
            id: 'i682LxWmGQ6',
            name: '-36 - -24',
        },
    ],
    name: 'Negative',
}

const tests = [
    {
        legendSet: positiveLegendSet,
        value: 60,
        expected: '#4292c6',
    },
    {
        legendSet: positiveLegendSet,
        value: '60.0',
        expected: '#4292c6',
    },
    {
        legendSet: positiveLegendSet,
        value: 0,
        expected: '#FFFFFF',
    },
    {
        legendSet: positiveLegendSet,
        value: '',
        expected: null,
    },
    {
        legendSet: positiveLegendSet,
        value: ' ',
        expected: null,
    },
    {
        legendSet: positiveLegendSet,
        value: 'ABC',
        expected: null,
    },
    {
        legendSet: negativeLegendSet,
        value: -50,
        expected: '#ffffb2',
    },
    {
        legendSet: negativeLegendSet,
        value: '-50.0',
        expected: '#ffffb2',
    },
    {
        legendSet: negativeLegendSet,
        value: 0,
        expected: '#A3A3A3',
    },
    {
        legendSet: negativeLegendSet,
        value: '',
        expected: null,
    },
]

describe('getColorByValueFromLegendSet', () => {
    tests.forEach((t) => {
        it(`Legend set: ${t.legendSet.name}, value: ${t.value}, expected: ${t.expected}`, () => {
            expect(getColorByValueFromLegendSet(t.legendSet, t.value)).toEqual(
                t.expected
            )
        })
    })
})
