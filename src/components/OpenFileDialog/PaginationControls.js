import i18n from '@dhis2/d2-i18n'
import { Pagination } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const PaginationControls = ({ page, pager, onPageChange }) => (
    <Pagination
        page={page}
        pageCount={pager.pageCount}
        pageSize={pager.pageSize}
        total={pager.total}
        onPageChange={onPageChange}
        onPageSizeChange={Function.prototype}
        hidePageSizeSelect
        pageSummaryText={({
            firstItem: firstItemIndex,
            lastItem: lastItemIndex,
            total: totalNumberOfItems,
        }) =>
            i18n.t(
                '{{firstItemIndex}}-{{lastItemIndex}} of {{totalNumberOfItems}}',
                {
                    firstItemIndex,
                    lastItemIndex,
                    totalNumberOfItems,
                }
            )
        }
    />
)

PaginationControls.propTypes = {
    page: PropTypes.number,
    pager: PropTypes.object,
    onPageChange: PropTypes.func,
}

export default PaginationControls
