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
        pageSummaryText={interpolationObject =>
            i18n.t(
                '{{firstItem}}-{{lastItem}} of {{total}}',
                interpolationObject
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
