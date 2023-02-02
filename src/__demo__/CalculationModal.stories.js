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
            id: 'iKGjnOOaPlE',
            name: 'ARI treated with antibiotics (pneumonia) new',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'XTqOHygxDj5',
            name: 'ARI treated with antibiotics (pneumonia) referrals',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'RF4VFVGdFRO',
            name: 'ARI treated without antibiotics (cough) follow-up',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'Cm4XUw6VAxv',
            name: 'ARI treated without antibiotics (cough) new',
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
            id: 'F53rTVTmSuF',
            name: 'ART No clients with change of regimen due to drug toxicity',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'rNEpbBxSyu7',
            name: 'ART No clients with new adverse drug reaction',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'CxlYcbqio4v',
            name: 'ART No started Opportunist Infection prophylaxis',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'NJnhOzjaLYk',
            name: 'ART clients with new adverse clinical event',
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
            id: 'eRwOwCpMzyP',
            name: 'ART enrollment stage 3',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'zYkwbCBALhn',
            name: 'ART enrollment stage 4',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'kVOiLDV4OC6',
            name: 'ART entry point: No PMTCT',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'I5MLuG16arn',
            name: 'ART entry point: No diagnostic testing',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'LVaUdM3CERi',
            name: 'ART entry point: No old patients',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'vJSPn2R6gVe',
            name: 'ART entry point: No other',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'HDZOFvdXsqE',
            name: 'ART entry point: No transfer in',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'soACnRV9gOI',
            name: 'ART entry point: No transfer out',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'FTy5pcJZ3yX',
            name: 'ART entry point: No walk in',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'Yf4u4QOIdsi',
            name: 'ART entry point: TB',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'QrhlrvV6Xs8',
            name: 'ART new clients started on ARV',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'ibL7BD2vn2C',
            name: 'ART treatment stopped due to death',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'TyQ1vOHM6JO',
            name: 'ART treatment stopped due to loss to follow-up',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'FTRrcoaog83',
            name: 'Accute Flaccid Paralysis (Deaths < 5 yrs)',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'P3jJH5Tu5VC',
            name: 'Acute Flaccid Paralysis (AFP) follow-up',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'FQ2o8UBlcrS',
            name: 'Acute Flaccid Paralysis (AFP) new',
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
            id: 'hCVSHjcml9g',
            name: 'Albendazole given at ANC (2nd trimester)',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'rxt7nvPyRUi',
            name: 'All access routes are clearly marked and safe',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'RUv0hqER0zV',
            name: 'All other follow-ups',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'A2VfEfPflHV',
            name: 'All other new',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'laZLQdnucV1',
            name: 'All other referrals',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'U7v0q0amJqi',
            name: 'All sterilisation equipment is validated / licensed',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'sPQgYGhXnXI',
            name: 'An alternative to communicate if telephone line is off is always available',
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
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'yqBkn9CWKih',
            name: 'Anaemia referrals',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'LjNlMTl9Nq9',
            name: 'Animal Bites - Rabid (Deaths < 5 yrs)',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 'a57FmdPj3Zl',
            name: 'Appropriate hand washing facilities are available',
        },
        {
            dimensionItemType: 'DATA_ELEMENT',
            id: 's46m5MS0hxu',
            name: 'BCG doses given',
        },
    ],
}

storiesOf('CalculationModal', module).add('Default', () => {
    return (
        <CustomDataProvider data={{ dataElements: DATA_ELEMENTS }}>
            <CalculationModal
                displayNameProp="name"
                onClose={Function.prototype}
                onDelete={Function.prototype}
                onSave={Function.prototype}
            />
        </CustomDataProvider>
    )
})
