export const currentUser = {
    id: 'currentuserid',
    name: 'John Traore',
    email: 'dummy@dhis2.org',
    settings: {
        keyDbLocale: 'en',
        keyMessageSmsNotification: false,
        keyTrackerDashboardLayout: '',
        keyCurrentStyle: 'light_blue/light_blue.css',
        keyStyle: 'light_blue/light_blue.css',
        keyUiLocale: 'en',
        keyAnalysisDisplayProperty: 'name',
        keyMessageEmailNotification: false,
    },
    authorities: ['F_VIEW_UNAPPROVED_DATA'],
}

export const interpretations = [
    {
        id: 'interpretation1',
        text: 'This is the first interpretation',
        created: '2025-09-04T07:47:12.477',
        createdBy: {
            id: 'currentuserid',
            code: null,
            name: 'John Traore',
            displayName: 'John Traore',
            username: 'admin',
        },
        comments: [
            {
                id: 'commentid1',
            },
            {
                id: 'commentid2',
            },
        ],
        likes: 1,
        access: {
            manage: true,
            write: true,
        },
        likedBy: [
            {
                id: 'currentuserid',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
        ],
    },
    {
        id: 'interpretation2',
        text: 'Analysis shows interesting trends in the data distribution across different regions',
        created: '2025-09-03T14:22:35.891',
        createdBy: {
            id: 'otheruserid1',
            code: null,
            name: 'Sarah Johnson',
            displayName: 'Sarah Johnson',
            username: 'sjohnson',
        },
        comments: [
            {
                id: 'commentid3',
            },
        ],
        likes: 3,
        access: {
            manage: false,
            write: false,
        },
        likedBy: [
            {
                id: 'currentuserid',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            {
                id: 'otheruserid1',
                code: null,
                name: 'Sarah Johnson',
                displayName: 'Sarah Johnson',
                username: 'sjohnson',
            },
            {
                id: 'otheruserid2',
                code: null,
                name: 'Mike Chen',
                displayName: 'Mike Chen',
                username: 'mchen',
            },
        ],
    },
    {
        id: 'interpretation3',
        text: 'The quarterly report reveals significant improvements in performance metrics',
        created: '2025-09-02T10:15:48.123',
        createdBy: {
            id: 'currentuserid',
            code: null,
            name: 'John Traore',
            displayName: 'John Traore',
            username: 'admin',
        },
        comments: [],
        likes: 0,
        access: {
            manage: true,
            write: true,
        },
        likedBy: [],
    },
    {
        id: 'interpretation4',
        text: 'We need to investigate the outliers in this dataset more thoroughly',
        created: '2025-09-01T16:33:21.654',
        createdBy: {
            id: 'otheruserid2',
            code: null,
            name: 'Mike Chen',
            displayName: 'Mike Chen',
            username: 'mchen',
        },
        comments: [
            {
                id: 'commentid4',
            },
            {
                id: 'commentid5',
            },
            {
                id: 'commentid6',
            },
        ],
        likes: 2,
        access: {
            manage: false,
            write: true,
        },
        likedBy: [
            {
                id: 'otheruserid1',
                code: null,
                name: 'Sarah Johnson',
                displayName: 'Sarah Johnson',
                username: 'sjohnson',
            },
            {
                id: 'otheruserid2',
                code: null,
                name: 'Mike Chen',
                displayName: 'Mike Chen',
                username: 'mchen',
            },
        ],
    },
]

export const interpretationDetails = {
    ...interpretations[0],
    comments: [
        {
            created: '2025-09-04T07:47:39.167',
            createdBy: {
                id: 'currentuserid',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            text: 'This is the first comment',
            id: 'commentid1',
        },
        {
            created: '2025-09-04T07:47:42.011',
            createdBy: {
                id: 'currentuserid',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            text: 'This is the second comment',
            id: 'commentid2',
        },
    ],
}

export const newInterpretation = {
    id: 'interpretation5',
    text: 'This is a new interpretation for testing',
    created: '2025-09-04T08:30:15.123',
    createdBy: {
        id: 'currentuserid',
        code: null,
        name: 'John Traore',
        displayName: 'John Traore',
        username: 'admin',
    },
    comments: [],
    likes: 0,
    access: {
        manage: true,
        write: true,
    },
    likedBy: [],
}

export const newComment = {
    created: '2025-09-04T08:45:22.456',
    createdBy: {
        id: 'currentuserid',
        code: null,
        name: 'John Traore',
        displayName: 'John Traore',
        username: 'admin',
    },
    text: 'This is a new comment for testing',
    id: 'commentid7',
}

export const visualization = {
    id: 'viz123',
    type: 'CHART',
}
