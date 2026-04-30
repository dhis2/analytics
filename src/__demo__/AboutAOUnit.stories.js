import { CustomDataProvider } from '@dhis2/app-runtime'
import React from 'react'
import AboutAOUnit from '../components/AboutAOUnit/AboutAOUnit.js'

const verboseData = {
    visualizations: {
        id: 'abc123verbose',
        displayDescription:
            'This is a comprehensive **visualization** showing district-level aggregate data across all 47 counties for the Expanded Programme on Immunization (EPI) including BCG, OPV, Pentavalent, and Measles-Rubella coverage rates disaggregated by age, sex, and facility ownership for the fiscal year 2024/2025.',
        created: '2023-01-15T08:30:00.000',
        createdBy: {
            displayName:
                'Dr. Alexandria Konstantinopolous-Whittington III, MD, PhD',
        },
        lastUpdated: '2024-11-02T14:22:00.000',
        subscribed: true,
        sharing: {
            public: 'r',
            users: {
                u1: {
                    displayName:
                        'Maria-Fernanda de los Ángeles Gutiérrez-Montoya',
                    access: 'rw',
                },
                u2: {
                    displayName: 'Jean-Pierre Barthélémy Christophersen',
                    access: 'r',
                },
            },
            userGroups: {
                g1: {
                    displayName:
                        'National Immunization Programme Monitoring & Evaluation Team',
                    access: 'rw',
                },
                g2: {
                    displayName:
                        'District Health Information System Administrators Group',
                    access: 'r',
                },
            },
        },
    },
    'dataStatistics/favorites': {
        views: 14873,
    },
}

const shortData = {
    visualizations: {
        id: 'xyz789short',
        displayDescription: 'ANC coverage Q3',
        created: '2025-12-01T10:00:00.000',
        createdBy: { displayName: 'Li Wei' },
        lastUpdated: '2026-04-10T09:00:00.000',
        subscribed: false,
        sharing: {
            public: 'rw',
            users: {},
            userGroups: {
                g1: { displayName: 'HMIS', access: 'r' },
            },
        },
    },
    'dataStatistics/favorites': {
        views: 3,
    },
}

const missingFieldsData = {
    visualizations: {
        id: 'missing456',
        displayDescription: null,
        created: '2026-03-20T12:00:00.000',
        createdBy: null,
        lastUpdated: '2026-04-13T06:45:00.000',
        subscribed: false,
        sharing: {
            public: '',
            users: {},
            userGroups: {},
        },
    },
    'dataStatistics/favorites': {
        views: 0,
    },
}

export default {
    title: 'AboutAOUnit',
}

export const VerboseData = () => (
    <CustomDataProvider data={verboseData}>
        <div
            style={{
                width: 372,
                padding: '16px',
                backgroundColor: 'lightgray',
            }}
        >
            <AboutAOUnit type="visualization" id="abc123verbose" />
        </div>
    </CustomDataProvider>
)

VerboseData.story = {
    name: 'Verbose data with long labels',
}

export const ShortLabels = () => (
    <CustomDataProvider data={shortData}>
        <div
            style={{
                width: 372,
                padding: '16px',
                backgroundColor: 'lightgray',
            }}
        >
            <AboutAOUnit type="visualization" id="xyz789short" />
        </div>
    </CustomDataProvider>
)

ShortLabels.story = {
    name: 'Short labels',
}

export const MissingFields = () => (
    <CustomDataProvider data={missingFieldsData}>
        <div
            style={{
                width: 372,
                padding: '16px',
                backgroundColor: 'lightgray',
            }}
        >
            <AboutAOUnit type="visualization" id="missing456" />
        </div>
    </CustomDataProvider>
)

MissingFields.story = {
    name: 'Missing fields (no description, no author, no sharing)',
}
