import { Provider, CustomDataProvider } from '@dhis2/app-runtime'
import { CssVariables } from '@dhis2/ui'
import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import { InterpretationsWrapper } from '../components/Interpretations/InterpretationsUnit/index.js'

const interpretations = {
    pager: {
        page: 1,
        total: 2,
        pageSize: 50,
        pageCount: 1,
    },
    interpretations: [
        {
            created: '2023-03-06T20:53:48.960',
            access: {
                manage: false,
                externalize: false,
                write: false,
                read: true,
                update: false,
                delete: false,
            },
            text: 'Delivery rates in Bo looks high',
            comments: [
                {
                    id: 'pgV3NCMjJOM',
                },
            ],
            likes: 0,
            user: {
                id: 'GOLswS44mh8',
                code: null,
                name: 'Tom Wakiki',
                displayName: 'Tom Wakiki',
                username: 'system',
            },
            id: 'FnIHFs31Fwe',
            likedBy: [],
        },
        {
            created: '2023-06-09T09:37:40.644',
            access: {
                manage: true,
                externalize: false,
                write: true,
                read: true,
                update: true,
                delete: true,
            },
            text: 'This is the _interpretation_ , you should *read* it @admin .',
            comments: [
                {
                    id: 'iZywPkEHRdn',
                },
                {
                    id: 'GHMaIz66jDR',
                },
                {
                    id: 'tpxKD9lshGQ',
                },
            ],
            likes: 0,
            user: {
                id: 'xE7jOejl9FI',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            id: 'O3oJ7neSCLB',
            likedBy: [],
        },
    ],
}

const interpretation = {
    created: '2023-06-09T09:37:40.644',
    access: {
        manage: true,
        externalize: false,
        write: true,
        read: true,
        update: true,
        delete: true,
    },
    text: 'This is the _interpretation_ , you should *read* it @admin .',
    comments: [
        {
            created: '2023-06-09T10:29:04.342',
            createdBy: {
                id: 'xE7jOejl9FI',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            access: {
                manage: true,
                externalize: false,
                write: true,
                read: true,
                update: true,
                delete: true,
            },
            text: 'Reply 1',
            id: 'iZywPkEHRdn',
        },
        {
            created: '2023-06-09T10:29:14.690',
            createdBy: {
                id: 'xE7jOejl9FI',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            access: {
                manage: true,
                externalize: false,
                write: true,
                read: true,
                update: true,
                delete: true,
            },
            text: 'Reply 2',
            id: 'GHMaIz66jDR',
        },
        {
            created: '2023-06-09T10:29:21.921',
            createdBy: {
                id: 'xE7jOejl9FI',
                code: null,
                name: 'John Traore',
                displayName: 'John Traore',
                username: 'admin',
            },
            access: {
                manage: true,
                externalize: false,
                write: true,
                read: true,
                update: true,
                delete: true,
            },
            text: 'Reply 3',
            id: 'tpxKD9lshGQ',
        },
    ],
    likes: 0,
    user: {
        id: 'xE7jOejl9FI',
        code: null,
        name: 'John Traore',
        displayName: 'John Traore',
        username: 'admin',
    },
    id: 'O3oJ7neSCLB',
    likedBy: [],
}

const getRelevantInterpretations = (type, query) => {
    if (query.id) {
        return interpretation
    }
    return interpretations
}

const visualization = {
    id: 'fluttershy',
    name: 'Fluttershy',
}

const currentUser = {
    id: 'flea333',
    displayName: 'Flea',
    name: 'Michael Balzary',
}

const InterpretationComponent = () => {
    // const [showReplyView, setShowReplyView] = useState(false)
    const [interpretationId, setInterpretationId] = useState(null)
    const onReplyIconClick = (id) => {
        console.log('interpretationId', id)
        setInterpretationId(id)
        // setShowReplyView(true)
    }

    const onGoBackClicked = () => {
        setInterpretationId(null)
    }

    return (
        <div style={{ width: '500px' }}>
            <InterpretationsWrapper
                type="visualization"
                id={visualization.id}
                currentUser={currentUser}
                disabled={false}
                onReplyIconClick={onReplyIconClick}
                interpretationId={interpretationId}
                onGoBackClicked={onGoBackClicked}
            />
        </div>
    )
}

storiesOf('InterpretationsWrapper', module)
    .add('Default', () => {
        return (
            <Provider>
                <CssVariables />
                <CustomDataProvider
                    data={{
                        interpretations,
                        interpretation,
                    }}
                >
                    <InterpretationsWrapper
                        // ref={someRef}
                        type="visualization"
                        id={visualization.id}
                        currentUser={currentUser}
                        onReplyIconClick={(interpretationId) =>
                            console.log('show interpretation', interpretationId)
                        }
                        disabled={false}
                    />
                </CustomDataProvider>
            </Provider>
        )
    })
    .add('Inline reply', () => {
        return (
            <CustomDataProvider
                data={{
                    interpretations: getRelevantInterpretations,
                }}
            >
                <InterpretationComponent />
            </CustomDataProvider>
        )
    })
