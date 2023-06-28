import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Box,
    Modal,
    ModalTitle,
    ModalContent,
    DataTable,
    DataTableHead,
    DataTableBody,
    DataTableRow,
    DataTableCell,
    DataTableColumnHeader,
    NoticeBox,
    CircularLoader,
    Button,
} from '@dhis2/ui'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import React, {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
} from 'react'
import {
    VIS_TYPE_GROUP_ALL,
    VIS_TYPE_GROUP_CHARTS,
} from '../../modules/visTypes.js'
import {
    CreatedByFilter,
    CREATED_BY_ALL,
    CREATED_BY_ALL_BUT_CURRENT_USER,
    CREATED_BY_CURRENT_USER,
} from './CreatedByFilter.js'
import { FileList } from './FileList.js'
import { NameFilter } from './NameFilter.js'
import { styles } from './OpenFileDialog.styles.js'
import { PaginationControls } from './PaginationControls.js'
import { getTranslatedString, AOTypeMap } from './utils.js'
import { VisTypeFilter } from './VisTypeFilter.js'

const getQuery = (type) => ({
    files: {
        resource: AOTypeMap[type].apiEndpoint,
        params: ({
            sortField = 'displayName',
            sortDirection = 'iasc',
            page = 1,
            filters,
        }) => {
            const queryParams = {
                filter: filters,
                fields: `id,type,displayName,title,displayDescription,created,lastUpdated,user,access,href`,
                paging: true,
                pageSize: 8,
                page,
            }

            if (sortDirection !== 'default') {
                queryParams.order = `${sortField}:${sortDirection}`
            }

            return queryParams
        },
    },
})

export const OpenFileDialog = ({
    type,
    open,
    filterVisTypes,
    defaultFilterVisType,
    onClose,
    onFileSelect,
    onNew,
    currentUser,
}) => {
    const filesQuery = useMemo(() => getQuery(type), [type])
    const defaultFilters = {
        searchTerm: '',
        createdBy: CREATED_BY_ALL,
        visType: defaultFilterVisType,
    }

    const [{ page, sortField, sortDirection, filters }, setState] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            page: 1,
            sortField: 'displayName',
            sortDirection: 'asc',
            filters: defaultFilters,
        }
    )

    const [nameFilterValue, setNameFilterValue] = useState(
        defaultFilters.searchTerm
    )
    const [searchTimeout, setSearchTimeout] = useState(null)

    const formatFilters = useCallback(() => {
        const queryFilters = []

        switch (filters.createdBy) {
            case CREATED_BY_ALL_BUT_CURRENT_USER:
                queryFilters.push(`user.id:!eq:${currentUser.id}`)
                break
            case CREATED_BY_CURRENT_USER:
                queryFilters.push(`user.id:eq:${currentUser.id}`)
                break
            case CREATED_BY_ALL:
            default:
                break
        }

        if (filters.visType) {
            switch (filters.visType) {
                case VIS_TYPE_GROUP_ALL:
                    break
                case VIS_TYPE_GROUP_CHARTS:
                    queryFilters.push('type:!eq:PIVOT_TABLE')
                    break
                default:
                    queryFilters.push(`type:eq:${filters.visType}`)
                    break
            }
        }

        if (filters.searchTerm) {
            queryFilters.push(`identifiable:token:${filters.searchTerm}`)
        }

        return queryFilters
    }, [currentUser, filters])

    const formatSortDirection = useCallback(() => {
        if (sortField === 'displayName' && sortDirection !== 'default') {
            return `i${sortDirection}`
        }

        return sortDirection
    }, [sortField, sortDirection])

    const { loading, error, data, refetch } = useDataQuery(filesQuery, {
        lazy: true,
        onComplete: (response) => {
            if (page !== response.files.pager.page) {
                setPage(response.files.pager.page)
            }
        },
    })

    const resetFilters = () => {
        setState({ filters: defaultFilters, page: 1 })
        setNameFilterValue(defaultFilters.searchTerm)
    }

    const setPage = (pageNum) =>
        setState({
            page: pageNum,
        })

    const sortData = ({ name, direction }) =>
        setState({
            sortField: name,
            sortDirection: direction,
            page: 1,
        })

    useEffect(() => {
        // only fetch data when the dialog is open
        if (open) {
            refetch({
                page,
                sortField,
                sortDirection: formatSortDirection(),
                filters: formatFilters(),
            })
        }
    }, [
        open,
        page,
        sortField,
        filters,
        refetch,
        formatFilters,
        formatSortDirection,
    ])

    const headers = [
        {
            field: 'displayName',
            label: i18n.t('Name'),
            width: '470px',
        },
        {
            field: 'created',
            label: i18n.t('Created'),
            width: '110px',
        },
        {
            field: 'lastUpdated',
            label: i18n.t('Last updated'),
            width: '110px',
        },
    ]

    if (filterVisTypes?.length) {
        headers.splice(1, 0, {
            field: 'type',
            label: i18n.t('Type'),
            width: '60px',
        })
    }

    const getSortDirection = (fieldName) =>
        fieldName === sortField ? sortDirection : 'default'

    const cypressSelector = 'open-file-dialog-modal'

    return (
        <Modal
            large
            position="top"
            hide={!open}
            onClose={onClose}
            dataTest={cypressSelector}
        >
            <ModalTitle>{getTranslatedString(type, 'modalTitle')}</ModalTitle>
            <ModalContent>
                <Box minHeight="496px">
                    <div className="search-and-filter-bar">
                        <div className="search-field-container">
                            <NameFilter
                                dataTest={`${cypressSelector}-name-filter`}
                                value={nameFilterValue}
                                onChange={(value) => {
                                    setNameFilterValue(value)

                                    clearTimeout(searchTimeout)
                                    setSearchTimeout(
                                        setTimeout(
                                            () =>
                                                setState({
                                                    page: 1,
                                                    filters: {
                                                        ...filters,
                                                        searchTerm: value,
                                                    },
                                                }),
                                            200
                                        )
                                    )
                                }}
                            />
                        </div>
                        {filterVisTypes?.length && (
                            <div className="type-field-container">
                                <VisTypeFilter
                                    visTypes={filterVisTypes}
                                    selected={filters.visType}
                                    onChange={(value) =>
                                        setState({
                                            page: 1,
                                            filters: {
                                                ...filters,
                                                visType: value,
                                            },
                                        })
                                    }
                                />
                            </div>
                        )}
                        <div className="created-by-field-container">
                            <CreatedByFilter
                                selected={filters.createdBy}
                                onChange={(value) =>
                                    setState({
                                        page: 1,
                                        filters: {
                                            ...filters,
                                            createdBy: value,
                                        },
                                    })
                                }
                            />
                        </div>
                        {!isEqual(filters, defaultFilters) && (
                            <Button onClick={resetFilters} secondary small>
                                {i18n.t('Clear filters')}
                            </Button>
                        )}
                    </div>
                    {error ? (
                        <NoticeBox
                            title={getTranslatedString(type, 'errorTitle')}
                            warning
                        >
                            {getTranslatedString(type, 'errorText')}
                        </NoticeBox>
                    ) : (
                        <>
                            <div className="data-table-wrapper">
                                <DataTable layout="fixed">
                                    <DataTableHead>
                                        <DataTableRow>
                                            {data?.files[
                                                AOTypeMap[type].apiEndpoint
                                            ].length ? (
                                                headers.map(
                                                    ({
                                                        field,
                                                        label,
                                                        width,
                                                    }) => (
                                                        <DataTableColumnHeader
                                                            width={width}
                                                            key={field}
                                                            name={field}
                                                            onSortIconClick={
                                                                sortData
                                                            }
                                                            sortDirection={getSortDirection(
                                                                field
                                                            )}
                                                        >
                                                            {label}
                                                        </DataTableColumnHeader>
                                                    )
                                                )
                                            ) : (
                                                <DataTableColumnHeader />
                                            )}
                                        </DataTableRow>
                                    </DataTableHead>
                                    <DataTableBody className="data-table-body">
                                        {loading && (
                                            <DataTableRow>
                                                <DataTableCell large>
                                                    <Box height="342px">
                                                        <div className="info-cell">
                                                            <CircularLoader
                                                                small
                                                            />
                                                            <span className="info-text">
                                                                {getTranslatedString(
                                                                    type,
                                                                    'loadingText'
                                                                )}
                                                            </span>
                                                        </div>
                                                    </Box>
                                                </DataTableCell>
                                            </DataTableRow>
                                        )}
                                        {!loading &&
                                            !data?.files[
                                                AOTypeMap[type].apiEndpoint
                                            ].length > 0 && (
                                                <DataTableRow>
                                                    <DataTableCell large>
                                                        <Box minHeight="342px">
                                                            <div className="info-cell">
                                                                <div className="info-container">
                                                                    {!isEqual(
                                                                        filters,
                                                                        defaultFilters
                                                                    ) ? (
                                                                        <span className="info-text">
                                                                            {getTranslatedString(
                                                                                type,
                                                                                'noFilteredDataText'
                                                                            )}
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            <div className="info-text">
                                                                                {getTranslatedString(
                                                                                    type,
                                                                                    'noDataText'
                                                                                )}
                                                                            </div>
                                                                            <div className="info-button">
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        onNew()
                                                                                        onClose()
                                                                                    }}
                                                                                >
                                                                                    {getTranslatedString(
                                                                                        type,
                                                                                        'newButtonLabel'
                                                                                    )}
                                                                                </Button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </Box>
                                                    </DataTableCell>
                                                </DataTableRow>
                                            )}
                                        {data?.files[
                                            AOTypeMap[type].apiEndpoint
                                        ].length > 0 && (
                                            <FileList
                                                data={
                                                    data.files[
                                                        AOTypeMap[type]
                                                            .apiEndpoint
                                                    ]
                                                }
                                                onSelect={onFileSelect}
                                                showVisTypeColumn={Boolean(
                                                    filterVisTypes?.length
                                                )}
                                            />
                                        )}
                                    </DataTableBody>
                                </DataTable>
                            </div>
                            {data?.files[AOTypeMap[type].apiEndpoint].length >
                                0 && (
                                <div className="pagination-controls">
                                    <PaginationControls
                                        page={data.files.pager.page}
                                        pager={data.files.pager}
                                        onPageChange={setPage}
                                    />
                                </div>
                            )}
                        </>
                    )}
                    <style jsx>{styles}</style>
                </Box>
            </ModalContent>
        </Modal>
    )
}

OpenFileDialog.propTypes = {
    currentUser: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(Object.keys(AOTypeMap)).isRequired,
    onClose: PropTypes.func.isRequired,
    onFileSelect: PropTypes.func.isRequired,
    onNew: PropTypes.func.isRequired,
    defaultFilterVisType: PropTypes.string,
    filterVisTypes: PropTypes.array,
}

export default OpenFileDialog
