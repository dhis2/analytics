import { storiesOf } from '@storybook/react'
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { createVisualization } from '../index.js'
const constainerStyleBase = {
    width: 800,
    height: 800,
    border: '1px solid magenta',
    marginBottom: 14,
}
const innerContainerStyle = {
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
}

const data = [
    {
        response: {
            headers: [
                {
                    name: 'dx',
                    column: 'Data',
                    valueType: 'TEXT',
                    type: 'java.lang.String',
                    hidden: false,
                    meta: true,
                },
                {
                    name: 'value',
                    column: 'Value',
                    valueType: 'NUMBER',
                    type: 'java.lang.Double',
                    hidden: false,
                    meta: false,
                },
            ],
            metaData: {
                items: {
                    202308: {
                        uid: '202308',
                        code: '202308',
                        name: 'August 2023',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2023-08-01T00:00:00.000',
                        endDate: '2023-08-31T00:00:00.000',
                    },
                    202309: {
                        uid: '202309',
                        code: '202309',
                        name: 'September 2023',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2023-09-01T00:00:00.000',
                        endDate: '2023-09-30T00:00:00.000',
                    },
                    202310: {
                        uid: '202310',
                        code: '202310',
                        name: 'October 2023',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2023-10-01T00:00:00.000',
                        endDate: '2023-10-31T00:00:00.000',
                    },
                    202311: {
                        uid: '202311',
                        code: '202311',
                        name: 'November 2023',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2023-11-01T00:00:00.000',
                        endDate: '2023-11-30T00:00:00.000',
                    },
                    202312: {
                        uid: '202312',
                        code: '202312',
                        name: 'December 2023',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2023-12-01T00:00:00.000',
                        endDate: '2023-12-31T00:00:00.000',
                    },
                    202401: {
                        uid: '202401',
                        code: '202401',
                        name: 'January 2024',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2024-01-01T00:00:00.000',
                        endDate: '2024-01-31T00:00:00.000',
                    },
                    202402: {
                        uid: '202402',
                        code: '202402',
                        name: 'February 2024',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2024-02-01T00:00:00.000',
                        endDate: '2024-02-29T00:00:00.000',
                    },
                    202403: {
                        uid: '202403',
                        code: '202403',
                        name: 'March 2024',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2024-03-01T00:00:00.000',
                        endDate: '2024-03-31T00:00:00.000',
                    },
                    202404: {
                        uid: '202404',
                        code: '202404',
                        name: 'April 2024',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2024-04-01T00:00:00.000',
                        endDate: '2024-04-30T00:00:00.000',
                    },
                    202405: {
                        uid: '202405',
                        code: '202405',
                        name: 'May 2024',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2024-05-01T00:00:00.000',
                        endDate: '2024-05-31T00:00:00.000',
                    },
                    202406: {
                        uid: '202406',
                        code: '202406',
                        name: 'June 2024',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2024-06-01T00:00:00.000',
                        endDate: '2024-06-30T00:00:00.000',
                    },
                    202407: {
                        uid: '202407',
                        code: '202407',
                        name: 'July 2024',
                        dimensionItemType: 'PERIOD',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                        startDate: '2024-07-01T00:00:00.000',
                        endDate: '2024-07-31T00:00:00.000',
                    },
                    ou: {
                        uid: 'ou',
                        name: 'Organisation unit',
                        dimensionType: 'ORGANISATION_UNIT',
                    },
                    O6uvpzGd5pu: {
                        uid: 'O6uvpzGd5pu',
                        code: 'OU_264',
                        name: 'Bo',
                        dimensionItemType: 'ORGANISATION_UNIT',
                        valueType: 'TEXT',
                        totalAggregationType: 'SUM',
                    },
                    LAST_12_MONTHS: {
                        name: 'Last 12 months',
                    },
                    dx: {
                        uid: 'dx',
                        name: 'Data',
                        dimensionType: 'DATA_X',
                    },
                    pe: {
                        uid: 'pe',
                        name: 'Period',
                        dimensionType: 'PERIOD',
                    },
                    FnYCr2EAzWS: {
                        uid: 'FnYCr2EAzWS',
                        code: 'IN_52493',
                        name: 'BCG Coverage <1y',
                        legendSet: 'BtxOoQuLyg1',
                        dimensionItemType: 'INDICATOR',
                        valueType: 'NUMBER',
                        totalAggregationType: 'AVERAGE',
                        indicatorType: {
                            name: 'Per cent',
                            displayName: 'Per cent',
                            factor: 100,
                            number: false,
                        },
                    },
                },
                dimensions: {
                    dx: ['FnYCr2EAzWS'],
                    pe: [
                        '202308',
                        '202309',
                        '202310',
                        '202311',
                        '202312',
                        '202401',
                        '202402',
                        '202403',
                        '202404',
                        '202405',
                        '202406',
                        '202407',
                    ],
                    ou: ['O6uvpzGd5pu'],
                    co: [],
                },
            },
            rowContext: {},
            rows: [['FnYCr2EAzWS', '34.19']],
            width: 2,
            height: 1,
            headerWidth: 2,
        },
        headers: [
            {
                name: 'dx',
                column: 'Data',
                valueType: 'TEXT',
                type: 'java.lang.String',
                hidden: false,
                meta: true,
                isPrefix: false,
                isCollect: false,
                index: 0,
            },
            {
                name: 'value',
                column: 'Value',
                valueType: 'NUMBER',
                type: 'java.lang.Double',
                hidden: false,
                meta: false,
                isPrefix: false,
                isCollect: false,
                index: 1,
            },
        ],
        rows: [['FnYCr2EAzWS', '34.19']],
        metaData: {
            items: {
                202308: {
                    uid: '202308',
                    code: '202308',
                    name: 'August 2023',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2023-08-01T00:00:00.000',
                    endDate: '2023-08-31T00:00:00.000',
                },
                202309: {
                    uid: '202309',
                    code: '202309',
                    name: 'September 2023',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2023-09-01T00:00:00.000',
                    endDate: '2023-09-30T00:00:00.000',
                },
                202310: {
                    uid: '202310',
                    code: '202310',
                    name: 'October 2023',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2023-10-01T00:00:00.000',
                    endDate: '2023-10-31T00:00:00.000',
                },
                202311: {
                    uid: '202311',
                    code: '202311',
                    name: 'November 2023',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2023-11-01T00:00:00.000',
                    endDate: '2023-11-30T00:00:00.000',
                },
                202312: {
                    uid: '202312',
                    code: '202312',
                    name: 'December 2023',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2023-12-01T00:00:00.000',
                    endDate: '2023-12-31T00:00:00.000',
                },
                202401: {
                    uid: '202401',
                    code: '202401',
                    name: 'January 2024',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2024-01-01T00:00:00.000',
                    endDate: '2024-01-31T00:00:00.000',
                },
                202402: {
                    uid: '202402',
                    code: '202402',
                    name: 'February 2024',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2024-02-01T00:00:00.000',
                    endDate: '2024-02-29T00:00:00.000',
                },
                202403: {
                    uid: '202403',
                    code: '202403',
                    name: 'March 2024',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2024-03-01T00:00:00.000',
                    endDate: '2024-03-31T00:00:00.000',
                },
                202404: {
                    uid: '202404',
                    code: '202404',
                    name: 'April 2024',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2024-04-01T00:00:00.000',
                    endDate: '2024-04-30T00:00:00.000',
                },
                202405: {
                    uid: '202405',
                    code: '202405',
                    name: 'May 2024',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2024-05-01T00:00:00.000',
                    endDate: '2024-05-31T00:00:00.000',
                },
                202406: {
                    uid: '202406',
                    code: '202406',
                    name: 'June 2024',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2024-06-01T00:00:00.000',
                    endDate: '2024-06-30T00:00:00.000',
                },
                202407: {
                    uid: '202407',
                    code: '202407',
                    name: 'July 2024',
                    dimensionItemType: 'PERIOD',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                    startDate: '2024-07-01T00:00:00.000',
                    endDate: '2024-07-31T00:00:00.000',
                },
                ou: {
                    uid: 'ou',
                    name: 'Organisation unit',
                    dimensionType: 'ORGANISATION_UNIT',
                },
                O6uvpzGd5pu: {
                    uid: 'O6uvpzGd5pu',
                    code: 'OU_264',
                    name: 'Bo',
                    dimensionItemType: 'ORGANISATION_UNIT',
                    valueType: 'TEXT',
                    totalAggregationType: 'SUM',
                },
                LAST_12_MONTHS: {
                    name: 'Last 12 months',
                },
                dx: {
                    uid: 'dx',
                    name: 'Data',
                    dimensionType: 'DATA_X',
                },
                pe: {
                    uid: 'pe',
                    name: 'Period',
                    dimensionType: 'PERIOD',
                },
                FnYCr2EAzWS: {
                    uid: 'FnYCr2EAzWS',
                    code: 'IN_52493',
                    name: 'BCG Coverage <1y',
                    legendSet: 'BtxOoQuLyg1',
                    dimensionItemType: 'INDICATOR',
                    valueType: 'NUMBER',
                    totalAggregationType: 'AVERAGE',
                    // indicatorType: {
                    //     name: 'Per cent',
                    //     displayName: 'Per cent',
                    //     factor: 100,
                    //     number: false,
                    // },
                    indicatorType: {
                        name: 'Custom',
                        displayName: 'Custom subtext',
                        number: true,
                    },
                },
            },
            dimensions: {
                dx: ['FnYCr2EAzWS'],
                pe: [
                    '202308',
                    '202309',
                    '202310',
                    '202311',
                    '202312',
                    '202401',
                    '202402',
                    '202403',
                    '202404',
                    '202405',
                    '202406',
                    '202407',
                ],
                ou: ['O6uvpzGd5pu'],
                co: [],
            },
        },
    },
]
const layout = {
    name: 'BCG coverage last 12 months - Bo',
    created: '2013-10-16T19:50:52.464',
    lastUpdated: '2021-07-06T12:53:57.296',
    translations: [],
    favorites: [],
    lastUpdatedBy: {
        id: 'xE7jOejl9FI',
        code: null,
        name: 'John Traore',
        displayName: 'John Traore',
        username: 'admin',
    },
    regressionType: 'NONE',
    displayDensity: 'NORMAL',
    fontSize: 'NORMAL',
    sortOrder: 0,
    topLimit: 0,
    hideEmptyRows: false,
    showHierarchy: false,
    completedOnly: false,
    skipRounding: false,
    dataDimensionItems: [
        {
            indicator: {
                name: 'BCG Coverage <1y',
                dimensionItemType: 'INDICATOR',
                displayName: 'BCG Coverage <1y',
                access: {
                    manage: true,
                    externalize: true,
                    write: true,
                    read: true,
                    update: true,
                    delete: true,
                },
                displayShortName: 'BCG Coverage <1y',
                id: 'FnYCr2EAzWS',
            },
            dataDimensionItemType: 'INDICATOR',
        },
    ],
    subscribers: [],
    aggregationType: 'DEFAULT',
    digitGroupSeparator: 'SPACE',
    hideEmptyRowItems: 'NONE',
    noSpaceBetweenColumns: false,
    cumulativeValues: false,
    percentStackedValues: false,
    showData: true,
    colTotals: false,
    rowTotals: false,
    rowSubTotals: false,
    colSubTotals: false,
    hideTitle: false,
    hideSubtitle: false,
    showDimensionLabels: false,
    interpretations: [],
    type: 'SINGLE_VALUE',
    reportingParams: {
        grandParentOrganisationUnit: false,
        parentOrganisationUnit: false,
        organisationUnit: false,
        reportingPeriod: false,
    },
    numberType: 'VALUE',
    fontStyle: {},
    colorSet: 'DEFAULT',
    yearlySeries: [],
    regression: false,
    hideEmptyColumns: false,
    fixColumnHeaders: false,
    fixRowHeaders: false,
    filters: [
        {
            items: [
                {
                    name: 'Bo',
                    dimensionItemType: 'ORGANISATION_UNIT',
                    displayShortName: 'Bo',
                    displayName: 'Bo',
                    access: {
                        manage: true,
                        externalize: true,
                        write: true,
                        read: true,
                        update: true,
                        delete: true,
                    },
                    id: 'O6uvpzGd5pu',
                },
            ],
            dimension: 'ou',
        },
        {
            items: [
                {
                    name: 'LAST_12_MONTHS',
                    dimensionItemType: 'PERIOD',
                    displayShortName: 'LAST_12_MONTHS',
                    displayName: 'LAST_12_MONTHS',
                    access: {
                        manage: true,
                        externalize: true,
                        write: true,
                        read: true,
                        update: true,
                        delete: true,
                    },
                    id: 'LAST_12_MONTHS',
                },
            ],
            dimension: 'pe',
        },
    ],
    parentGraphMap: {
        O6uvpzGd5pu: 'ImspTQPwCqd',
    },
    columns: [
        {
            items: [
                {
                    name: 'BCG Coverage <1y',
                    dimensionItemType: 'INDICATOR',
                    displayName: 'BCG Coverage <1y',
                    access: {
                        manage: true,
                        externalize: true,
                        write: true,
                        read: true,
                        update: true,
                        delete: true,
                    },
                    displayShortName: 'BCG Coverage <1y',
                    id: 'FnYCr2EAzWS',
                },
            ],
            dimension: 'dx',
        },
    ],
    rows: [],
    subscribed: false,
    displayName: 'BCG coverage last 12 months - Bo',
    access: {
        manage: true,
        externalize: true,
        write: true,
        read: true,
        update: true,
        delete: true,
    },
    favorite: false,
    user: {
        id: 'xE7jOejl9FI',
        code: null,
        name: 'John Traore',
        displayName: 'John Traore',
        username: 'admin',
    },
    href: 'http://localhost:8080/api/41/visualizations/mYMnDl5Z9oD',
    id: 'mYMnDl5Z9oD',
    legend: {
        showKey: false,
    },
    sorting: [],
    series: [],
    icons: [],
    seriesKey: {
        hidden: false,
    },
    axes: [],
}
const icon =
    '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 12.5C32 13.0523 32.4477 13.5 33 13.5C33.5523 13.5 34 13.0523 34 12.5V11C34 10.4477 33.5523 10 33 10C32.4477 10 32 10.4477 32 11V12.5Z" fill="currentColor"/><path d="M16 24V27H18V24H21V22H18V19H16V22H13V24H16Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4 17C4 15.3431 5.34315 14 7 14H27C28.6569 14 30 15.3431 30 17V19H31V18H32V17C32 16.4477 32.4477 16 33 16C33.5523 16 34 16.4477 34 17V18H35V19H35.718C36.4722 19 37.1987 19.284 37.7529 19.7956L43.0348 24.6713C43.6501 25.2392 44 26.0384 44 26.8757V35H38.874C38.4299 36.7252 36.8638 38 35 38C33.1362 38 31.5701 36.7252 31.126 35H15.874C15.4299 36.7252 13.8638 38 12 38C10.1362 38 8.57006 36.7252 8.12602 35H4V17ZM31.126 33C31.5701 31.2748 33.1362 30 35 30C36.8638 30 38.4299 31.2748 38.874 33H42V28L30 28V33H31.126ZM30 26L41.5257 26L36.3963 21.2652C36.2116 21.0947 35.9694 21 35.718 21H30V26ZM27 16C27.5523 16 28 16.4477 28 17V33H15.874C15.4299 31.2748 13.8638 30 12 30C10.1362 30 8.57006 31.2748 8.12602 33H6V17C6 16.4477 6.44772 16 7 16H27ZM12 36C13.1046 36 14 35.1046 14 34C14 32.8954 13.1046 32 12 32C10.8954 32 10 32.8954 10 34C10 35.1046 10.8954 36 12 36ZM37 34C37 35.1046 36.1046 36 35 36C33.8954 36 33 35.1046 33 34C33 32.8954 33.8954 32 35 32C36.1046 32 37 32.8954 37 34Z" fill="currentColor"/><path d="M36.5 17C36.5 16.4477 36.9477 16 37.5 16H39C39.5523 16 40 16.4477 40 17C40 17.5523 39.5523 18 39 18H37.5C36.9477 18 36.5 17.5523 36.5 17Z" fill="currentColor"/><path d="M35.8285 12.759C35.4193 13.1298 35.3881 13.7622 35.759 14.1715C36.1298 14.5807 36.7622 14.6119 37.1715 14.241L38.0857 13.4126C38.4949 13.0417 38.5261 12.4093 38.1552 12.0001C37.7844 11.5908 37.152 11.5597 36.7427 11.9306L35.8285 12.759Z" fill="currentColor"/></svg>'

const extraOptions = {
    dashboard: false,
    animation: 200,
    legendSets: [],
    icon,
}

storiesOf('SingleValue', module).add('default', () => {
    const newChartRef = useRef(null)
    const oldContainerRef = useRef(null)
    const newContainerRef = useRef(null)
    const [transpose, setTranspose] = useState(false)
    const [width, setWidth] = useState(constainerStyleBase.width)
    const [height, setHeight] = useState(constainerStyleBase.height)
    const containerStyle = useMemo(
        () => ({
            ...constainerStyleBase,
            width,
            height,
        }),
        [width, height]
    )
    useEffect(() => {
        if (oldContainerRef.current && newContainerRef.current) {
            requestAnimationFrame(() => {
                createVisualization(
                    data,
                    layout,
                    oldContainerRef.current,
                    extraOptions,
                    undefined,
                    undefined,
                    'dhis'
                )
                const newVisualization = createVisualization(
                    data,
                    layout,
                    newContainerRef.current,
                    extraOptions,
                    undefined,
                    undefined,
                    'singleValue'
                )
                newChartRef.current = newVisualization.visualization
            })
        }
    }, [containerStyle])
    const downloadOffline = useCallback(() => {
        if (newChartRef.current) {
            newChartRef.current.exportChartLocal({
                sourceHeight: 768,
                sourceWidth: 1024,
                scale: 1,
                fallbackToExportServer: false,
                filename: 'testOfflineDownload',
                showExportInProgress: true,
                type: 'image/png',
            })
        }
    }, [])

    return (
        <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div>
                    <label htmlFor="width">Width</label>
                    <input
                        type="number"
                        name="width"
                        id="width"
                        min="1"
                        step="5"
                        onChange={(event) =>
                            setWidth(parseInt(event.target.value))
                        }
                        value={width.toString()}
                    />
                </div>
                <div>
                    <label htmlFor="height">Height</label>
                    <input
                        type="number"
                        name="height"
                        id="height"
                        min="1"
                        step="5"
                        onChange={(event) =>
                            setHeight(parseInt(event.target.value))
                        }
                        value={height.toString()}
                    />
                </div>
                <button onClick={downloadOffline}>Download offline</button>
                <button
                    onClick={() => {
                        setTranspose(!transpose)
                    }}
                >
                    {transpose ? 'Show side by side' : 'Transpose old and new'}
                </button>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
                <div
                    style={
                        transpose
                            ? {
                                  ...containerStyle,
                                  ...{
                                      opacity: 0.45,
                                      transform: `translateX(${width + 10}px)`,
                                      zIndex: 10,
                                      backgroundColor: 'purple',
                                  },
                              }
                            : containerStyle
                    }
                >
                    <div
                        ref={oldContainerRef}
                        style={innerContainerStyle}
                    ></div>
                </div>
                <div style={containerStyle}>
                    <div
                        ref={newContainerRef}
                        style={innerContainerStyle}
                    ></div>
                </div>
            </div>
        </>
    )
})
