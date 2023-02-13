import { CustomDataProvider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React from 'react'
import CalculationModal from '../components/DataDimension/CalculationModal.js'

const DATA_ELEMENTS = {
    pager: {
        page: 1,
        total: 622,
        pageSize: 50,
        nextPage:
            'http://localhost:8080/api/39/dataElements?page=2&filter=domainType%3Aeq%3AAGGREGATE&paging=true&fields=dimensionItem%7Erename%28id%29%2CdisplayName%7Erename%28name%29%2CdimensionItemType&order=displayName%3Aasc',
        pageCount: 13,
    },
    dataElements: [
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'fbfJHSPpUQD',
            name: 'ANC 1st visit',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'cYeuwXTCPkU',
            name: 'ANC 2nd visit',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'Jtf34kNZhzP',
            name: 'ANC 3rd visit',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'hfdmMSPBgLG',
            name: 'ANC 4th or more visits',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'FHD3wiSM7Sn',
            name: 'ARI treated with antibiotics (pneumonia) follow-up',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'oLfWYAJhZb2',
            name: 'ARI treated without antibiotics (cough) referrals',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'GMd99K8gVut',
            name: 'ART No clients who stopped TRT due to TRT failure',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'wfKKFhBn0Q0',
            name: 'ART No clients who stopped TRT due to adverse clinical status/event',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'aIJZ2d2QgVV',
            name: 'ART defaulters',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'BOSZApCrBni',
            name: 'ART enrollment stage 1',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'dGdeotKpRed',
            name: 'ART enrollment stage 2',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'LVaUdM3CERi',
            name: 'ART entry point: No old patients',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'M62VHgYT2n0',
            name: 'Acute Flaccid Paralysis (AFP) referrals',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'uF1DLnZNlWe',
            name: 'Additional notes related to facility',
        },

        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'jmWyJFtE7Af',
            name: 'Anaemia follow-up',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'HLPuaFB7Frw',
            name: 'Anaemia new',
        },
    ],
}

const DATA_ELEMENT_GROUPS = {
    dataElementGroups: [
        { id: 'qfxEYY9xAl6', name: 'ANC' },
        { id: 'yhg8oYU9ekY', name: 'ARI Treated Without Antibiotics (Cough)' },
        { id: 'M2cth8EmrlT', name: 'ARI treated with antibiotics (Pneumonia)' },
        { id: 'k1M0nuodfhN', name: 'ART' },
        { id: 'bdiyMm9qZl5', name: 'ART enrollment' },
        { id: 's8FiXqB2DhB', name: 'ART entry points' },
        { id: 'TcxHxMlYzpv', name: 'ART pediatric 1st line' },
        { id: 'vxIWSNeEcf7', name: 'ART staging' },
        { id: 'zz1lNBgRKWU', name: 'ART treatment' },
        { id: 'oDkJh5Ddh7d', name: 'Acute Flaccid Paralysis (AFP) ' },
        { id: 'GBHN1a1Jddh', name: 'All Others' },
        { id: 'KmwPVkjp7yl', name: 'Anaemia' },
        { id: 'oGktdmYkRNo', name: 'Burns' },
        { id: 'KUSvwZQsMSN', name: 'Cholera' },
        { id: 'Euvh58hLl61', name: 'Clinical Malnutrition' },
        { id: 'Svac1cNQhRS', name: 'Commodities' },
        { id: 'KJKWrWBcJdf', name: 'Commodities Child Health' },
        { id: 'idD1wcvBISQ', name: 'Commodities Maternal Health' },
        { id: 'rioWDAi1S7z', name: 'Commodities Newborn Health' },
        { id: 'IyIa0h8CbCZ', name: 'Commodities Reproductive Health' },
        { id: 'PfJGQacYpjn', name: 'Deaths' },
        { id: 't5W0AAqvK5b', name: 'Delivery' },
        { id: 'mcjC3qZgIkO', name: 'Diarrhoea With Blood (Dysentery)' },
        { id: 'RSFc8ADyKTw', name: 'Diarrhoea With Severe Dehydration' },
        { id: 'kE8lP5t0b5R', name: 'Diarrhoea Without Severe Dehydration' },
        { id: 'qiF051Ue9Ei', name: 'Emergency Response' },
        { id: 'GbSz3TobZcc', name: 'Expenditures' },
        { id: 'lLKpwhjd1dM', name: 'Eye Infection' },
        { id: 'Sp1jJqzsiOi', name: 'Facility infrastructure' },
        { id: 'g50BzGAsrvu', name: 'Follow-up' },
        { id: 'URmi41e0SFH', name: 'HIV Care' },
        { id: 'ID4BbhF7Eli', name: 'HIV Peadriatics' },
        { id: 'HKU7L73im5r', name: 'HIV/AIDS' },
        { id: 'jWgEsdH87Jk', name: 'Hypertension' },
        { id: 'nb3rBNvVHtp', name: 'ICS Children' },
        { id: 'dMyLpSQn6hu', name: 'ICS mother' },
        { id: 'b3gDdvmrSFc', name: 'IDSR' },
        { id: 'h9cuJOkOwY2', name: 'Immunization' },
        { id: 'OP4dLqk0JTH', name: 'Inpatient morbidity/mortality aggregates' },
        { id: 'SriP0jBXMr6', name: 'Lassa Fever' },
        { id: 'U0uJG4kydwE', name: 'Leprosy' },
        { id: 'eeQCyjnMyGY', name: 'Low birth' },
        { id: 'LEet4tb49IP', name: 'MNCH Aggregates' },
        { id: 'TzwKbcw1nUK', name: 'Malaria' },
        { id: 'qk2KOBMX4Mf', name: 'Measles' },
        { id: 'lnLbEej0gwe', name: 'Meningitis / Severe Bacterial Infection' },
        { id: 'SLsJy3zqUbD', name: 'Morbidity' },
        { id: 'QAc5FhbeFwl', name: 'Mortality' },
        { id: 'rPGfUFYbcfJ', name: 'Mortality < 5 years' },
        { id: 'KU0wDurtWDM', name: 'Mortality Narrative' },
        { id: 'UAEhIWpoQFN', name: 'Neonatal Tetanus' },
        { id: 'weRMUzBs8T7', name: 'New cases' },
        { id: 'XGSHYf5uOlJ', name: 'New on ART' },
        { id: 'u1ilfnoYafG', name: 'Nutrition' },
        { id: 'HDdnX6XqxIn', name: 'Onchocerciasis' },
        { id: 'JZ3usxLEcc9', name: 'Otitis Media' },
        { id: 'WS3MniopkOQ', name: 'PMTCT' },
        { id: 'e5NGCRQR8Yo', name: 'PMTCT ANC' },
        { id: 'bXpe2ByvlFR', name: 'PMTCT Maternity/Delivery' },
        { id: 'sGLusXgmaOT', name: 'PMTCT Postnatal' },
        { id: 'sP7jTt3YGBb', name: 'Population Estimates' },
        { id: 'ubJrVb4v5xy', name: 'Postnatal' },
        { id: 'qkrZMU4Y2h5', name: 'Pregnancy complications and deaths' },
        { id: 'ZPtRFVLY40u', name: 'Pregnancy-related (PHUF5)' },
        { id: 'AiytigJkHP6', name: 'Prev month on ART' },
        { id: 'UWaMbg9h7vF', name: 'Referrals' },
        { id: 'OJxi4vkcTBS', name: 'Reproductive health' },
        { id: 'xNrDrDbJgnm', name: 'STI - Genital Discharge' },
        { id: 'UmyRWILcoed', name: 'STI - Genital Ulcer' },
        { id: 'LqG1FnAUhyb', name: 'Schistosomiasis' },
        { id: 'rwG73cCi66Z', name: 'Shift from ART reg.' },
        { id: 'rgTZ4mKjZza', name: 'Shift to ART reg.' },
        { id: 'VCoSeRRVS1n', name: 'Skin Infection' },
        { id: 'rVEe5QNBgDX', name: 'Staffing' },
        { id: 'pxWhf42tCIs', name: 'Stock PHU' },
        { id: 'OnAQ2lsilN9', name: 'TB' },
        { id: 'LgtuBcNaMB3', name: 'Tetanus' },
        { id: 'yHtsPZqpAxm', name: 'Tuberculosis' },
        { id: 'dUK38PhdUdV', name: 'Typhoid Fever' },
        { id: 'U9wcARyKSzx', name: 'VCCT' },
        { id: 'LzDaTmQYWcj', name: 'Worm Infestation' },
        { id: 'IUZ0GidX0jh', name: 'Wounds/Trauma' },
        { id: 'zmWJAEjfv59', name: 'Yaws' },
        { id: 'HAraPb0v7ex', name: 'Yellow Fever' },
    ],
}

const calculation = {
    id: 'calculationid',
    name: 'My calculation',
    expression: '#{fbfJHSPpUQD}/10*#{hfdmMSPBgLG}',
}

storiesOf('CalculationModal', module)
    .add('Default', () => {
        return (
            <CustomDataProvider
                data={{
                    dataElements: DATA_ELEMENTS,
                    dataElementGroups: DATA_ELEMENT_GROUPS,
                }}
            >
                <CalculationModal
                    displayNameProp="name"
                    onClose={Function.prototype}
                    onDelete={Function.prototype}
                    onSave={Function.prototype}
                />
            </CustomDataProvider>
        )
    })
    .add('With calculation', () => {
        return (
            <CustomDataProvider
                data={{
                    dataElements: DATA_ELEMENTS,
                    dataElementGroups: DATA_ELEMENT_GROUPS,
                }}
            >
                <CalculationModal
                    calculation={calculation}
                    displayNameProp="name"
                    onClose={Function.prototype}
                    onDelete={Function.prototype}
                    onSave={Function.prototype}
                />
            </CustomDataProvider>
        )
    })
