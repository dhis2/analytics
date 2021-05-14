import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash/isEqual'
import i18n from '@dhis2/d2-i18n'
import { useDataQuery } from '@dhis2/app-runtime'
import {
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
import { useDebounce } from '../../modules/utils'
import { styles } from './OpenFileDialog.styles'
import { FileList } from './FileList'
import { NameFilter } from './NameFilter'
import { VisTypeFilter } from './VisTypeFilter'
import { OwnerFilter } from './OwnerFilter'
import { PaginationControls } from './PaginationControls'

const getResourceFromType = type => `${type}s`

const getQuery = type => ({
    resource: getResourceFromType(type),
    params: ({
        sortField = 'name',
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
})

export const OpenFileDialog = ({
    type,
    open,
    onClose,
    onFileSelect,
    onNew,
    currentUser,
}) => {
    const filesQuery = useMemo(() => getQuery(type), [])
    const defaultFilters = {
        searchTerm: '',
        createdBy: 'all',
        visType: 'all',
    }

    const [{ sortField, sortDirection }, setSorting] = useState({
        sortField: 'displayName',
        sortDirection: 'asc',
    })
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState(defaultFilters.searchTerm)
    const searchTermDebounced = useDebounce(searchTerm, 200)
    const [createdBy, setCreatedBy] = useState(defaultFilters.createdBy)
    const [visType, setVisTypeFilter] = useState(defaultFilters.visType)
    const [filters, setFilters] = useState(defaultFilters)

    const formatFilters = ({ searchTerm, createdBy, visType }) => {
        const queryFilters = []

        switch (createdBy) {
            case 'byothers':
                queryFilters.push(`user.id:!eq:${currentUser.id}`)
                break
            case 'byme':
                queryFilters.push(`user.id:eq:${currentUser.id}`)
                break
            case 'all':
            default:
                break
        }

        switch (visType) {
            case 'all':
                break
            case 'chart':
                queryFilters.push('type:!eq:PIVOT_TABLE')
                break
            default:
                queryFilters.push(`type:eq:${visType}`)
                break
        }

        if (searchTerm) {
            queryFilters.push(`name:ilike:${searchTerm}`)
        }

        return queryFilters
    }

    const { loading, error, data, refetch } = useDataQuery(
        { files: filesQuery },
        { lazy: true }
    )

    const resetFilters = () => {
        setFilters(defaultFilters)
        setSearchTerm(defaultFilters.searchTerm)
        setCreatedBy(defaultFilters.createdBy)
        setVisTypeFilter(defaultFilters.visType)
    }

    const getString = (type, key) => {
        let texts = {
            modalTitle: i18n.t('Open'),
            loadingText: i18n.t('Loading'),
            errorTitle: i18n.t("Couldn't load items"),
            errorText: i18n.t(
                'There was a problem loading items. Try again or contact your system administrator.'
            ),
            noDataText: i18n.t('No items found. Create a new to get started.'),
            noFilteredDataText: i18n.t(
                "No items found. Try adjusting your search or filter options to find what you're looking for."
            ),
            newButtonLabel: i18n.t('Create new'),
        }

        switch (type) {
            case 'visualization': {
                texts = {
                    modalTitle: i18n.t('Open a visualization'),
                    loadingText: i18n.t('Loading visualizations'),
                    errorTitle: i18n.t("Couldn't load visualizations"),
                    errorText: i18n.t(
                        'There was a problem loading visualizations. Try again or contact your system administrator.'
                    ),
                    noDataText: i18n.t(
                        'No visualizations found. Click New visualization to get started.'
                    ),
                    noFilteredDataText: i18n.t(
                        "No visualizations found. Try adjusting your search or filter options to find what you're looking for."
                    ),
                    newButtonLabel: i18n.t('New visualization'),
                }
                break
            }
            case 'map': {
                texts = {
                    modalTitle: i18n.t('Open a map'),
                    loadingText: i18n.t('Loading maps'),
                    errorTitle: i18n.t("Couldn't load maps"),
                    errorText: i18n.t(
                        'There was a problem loading maps. Try again or contact your system administrator.'
                    ),
                    noDataText: i18n.t(
                        'No maps found. Click New map to get started.'
                    ),
                    noFilteredDataText: i18n.t(
                        "No maps found. Try adjusting your search or filter options to find what you're looking for."
                    ),
                    newButtonLabel: i18n.t('New map'),
                }
                break
            }
        }

        return texts[key]
    }

    useEffect(() => {
        setFilters({
            ...filters,
            searchTerm: searchTermDebounced,
            createdBy,
            visType,
        })
        setPage(1)
    }, [searchTermDebounced, createdBy, visType])

    useEffect(() => {
        // only fetch data when the dialog is open
        if (open) {
            refetch({
                page,
                sortField,
                sortDirection,
                filters: formatFilters(filters),
            })
        }
    }, [open, page, sortField, sortDirection, filters])

    const headers = [
        {
            field: 'displayName',
            label: i18n.t('Name'),
        },
        {
            field: 'created',
            label: i18n.t('Created'),
        },
        {
            field: 'lastUpdated',
            label: i18n.t('Last updated'),
        },
    ]

    if (type === 'visualization') {
        headers.splice(1, 0, {
            field: 'type',
            label: i18n.t('Type'),
        })
    }

    const getSortDirection = fieldName =>
        fieldName === sortField ? sortDirection : 'default'

    return (
        open && (
            <Modal large position="middle" onClose={onClose}>
                <ModalTitle>{getString(type, 'modalTitle')}</ModalTitle>
                <ModalContent>
                    <div className="search-and-filter-bar">
                        <div className="search-field-container">
                            <NameFilter
                                value={searchTerm}
                                onChange={setSearchTerm}
                            />
                        </div>
                        {type === 'visualization' && (
                            <div className="type-field-container">
                                <VisTypeFilter
                                    selected={visType}
                                    onChange={setVisTypeFilter}
                                />
                            </div>
                        )}
                        <div className="created-by-field-container">
                            <OwnerFilter
                                selected={createdBy}
                                onChange={setCreatedBy}
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
                            title={getString(type, 'errorTitle')}
                            warning
                        >
                            {getString(type, 'errorText')}
                        </NoticeBox>
                    ) : (
                        <>
                            <DataTable>
                                <DataTableHead>
                                    <DataTableRow>
                                        {data?.files[getResourceFromType(type)]
                                            .length ? (
                                            headers.map(({ field, label }) => (
                                                <DataTableColumnHeader
                                                    fixed
                                                    top="0"
                                                    key={field}
                                                    name={field}
                                                    onSortIconClick={({
                                                        name,
                                                        direction,
                                                    }) =>
                                                        setSorting({
                                                            sortField: name,
                                                            sortDirection: direction,
                                                        })
                                                    }
                                                    sortDirection={getSortDirection(
                                                        field
                                                    )}
                                                >
                                                    {label}
                                                </DataTableColumnHeader>
                                            ))
                                        ) : (
                                            <DataTableColumnHeader
                                                fixed
                                                top="0"
                                            />
                                        )}
                                    </DataTableRow>
                                </DataTableHead>
                                <DataTableBody className="data-table-body">
                                    {loading && (
                                        <DataTableRow>
                                            <DataTableCell large>
                                                <div className="info-cell">
                                                    <CircularLoader small />
                                                    <span className="info-text">
                                                        {getString(
                                                            type,
                                                            'loadingText'
                                                        )}
                                                    </span>
                                                </div>
                                            </DataTableCell>
                                        </DataTableRow>
                                    )}
                                    {!loading &&
                                        !data?.files[getResourceFromType(type)]
                                            .length && (
                                            <DataTableRow>
                                                <DataTableCell large>
                                                    <div className="info-cell">
                                                        <div className="info-container">
                                                            {!isEqual(
                                                                filters,
                                                                defaultFilters
                                                            ) ? (
                                                                <span className="info-text">
                                                                    {getString(
                                                                        type,
                                                                        'noFilteredDataText'
                                                                    )}
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <div className="info-text">
                                                                        {getString(
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
                                                                            {getString(
                                                                                type,
                                                                                'newButtonLabel'
                                                                            )}
                                                                        </Button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </DataTableCell>
                                            </DataTableRow>
                                        )}
                                    {Boolean(
                                        data?.files[getResourceFromType(type)]
                                            .length
                                    ) && (
                                        <FileList
                                            type={type}
                                            data={
                                                data.files[
                                                    getResourceFromType(type)
                                                ]
                                            }
                                            onSelect={onFileSelect}
                                        />
                                    )}
                                </DataTableBody>
                            </DataTable>
                            {Boolean(
                                data?.files[getResourceFromType(type)].length
                            ) && (
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
                </ModalContent>
            </Modal>
        )
    )
}

OpenFileDialog.defaultProps = {
    open: false,
}

OpenFileDialog.propTypes = {
    type: PropTypes.oneOf(['visualization', 'eventChart', 'eventReport', 'map'])
        .isRequired,
    onClose: PropTypes.func.isRequired,
    onFileSelect: PropTypes.func.isRequired,
    onNew: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    open: PropTypes.bool,
}

export default OpenFileDialog
