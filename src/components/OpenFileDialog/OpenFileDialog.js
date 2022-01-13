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
    DataTableToolbar,
    NoticeBox,
    CircularLoader,
    Button,
} from '@dhis2/ui'
import isEqual from 'lodash/isEqual'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { VIS_TYPE_ALL, VIS_TYPE_CHARTS } from '../../modules/visTypes.js'
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
            sortDirection = 'asc',
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
    const filesQuery = useMemo(() => getQuery(type), [])
    const defaultFilters = {
        searchTerm: '',
        createdBy: CREATED_BY_ALL,
        visType: defaultFilterVisType,
    }

    const [{ sortField, sortDirection }, setSorting] = useState({
        sortField: 'displayName',
        sortDirection: 'asc',
    })
    const [page, setPage] = useState(1)
    const [nameFilterValue, setNameFilterValue] = useState(
        defaultFilters.searchTerm
    )
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [filters, setFilters] = useState(defaultFilters)

    const formatFilters = () => {
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
                case VIS_TYPE_ALL:
                    break
                case VIS_TYPE_CHARTS:
                    queryFilters.push('type:!in:[PIVOT_TABLE,LINE_LIST]')
                    break
                default:
                    queryFilters.push(`type:eq:${filters.visType}`)
                    break
            }
        }

        if (filters.searchTerm) {
            queryFilters.push(`name:ilike:${filters.searchTerm}`)
        }

        return queryFilters
    }

    const { loading, error, data, refetch } = useDataQuery(filesQuery, {
        lazy: true,
    })

    const resetFilters = () => {
        setFilters(defaultFilters)
        setNameFilterValue(defaultFilters.searchTerm)
    }

    useEffect(() => {
        // only fetch data when the dialog is open
        if (open) {
            refetch({
                page,
                sortField,
                sortDirection,
            })
        }
    }, [open, page, sortField, sortDirection])

    useEffect(() => {
        // avoid fetching data when the dialog is first rendered (hidden)
        if (open) {
            // reset pagination when filters are applied/changed
            setPage(1)

            refetch({
                sortField,
                sortDirection,
                filters: formatFilters(),
            })
        }
    }, [filters])

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
            position="middle"
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
                                                setFilters({
                                                    ...filters,
                                                    searchTerm: value,
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
                                        setFilters({
                                            ...filters,
                                            visType: value,
                                        })
                                    }
                                />
                            </div>
                        )}
                        <div className="created-by-field-container">
                            <CreatedByFilter
                                selected={filters.createdBy}
                                onChange={(value) =>
                                    setFilters({
                                        ...filters,
                                        createdBy: value,
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
                            <DataTable layout="fixed">
                                <DataTableHead>
                                    <DataTableRow>
                                        {data?.files[
                                            AOTypeMap[type].apiEndpoint
                                        ].length ? (
                                            headers.map(
                                                ({ field, label, width }) => (
                                                    <DataTableColumnHeader
                                                        width={width}
                                                        key={field}
                                                        name={field}
                                                        onSortIconClick={({
                                                            name,
                                                            direction,
                                                        }) =>
                                                            setSorting({
                                                                sortField: name,
                                                                sortDirection:
                                                                    direction,
                                                            })
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
                                                <Box height="384px">
                                                    <div className="info-cell">
                                                        <CircularLoader small />
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
                                                    <Box minHeight="384px">
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
                                    {data?.files[AOTypeMap[type].apiEndpoint]
                                        .length > 0 && (
                                        <FileList
                                            data={
                                                data.files[
                                                    AOTypeMap[type].apiEndpoint
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
                            {data?.files[AOTypeMap[type].apiEndpoint].length >
                                0 && (
                                <DataTableToolbar position="bottom">
                                    <div className="pagination-controls">
                                        <PaginationControls
                                            page={page}
                                            pager={data.files.pager}
                                            onPageChange={setPage}
                                        />
                                    </div>
                                </DataTableToolbar>
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
