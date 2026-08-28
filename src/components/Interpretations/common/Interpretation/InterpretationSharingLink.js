import i18n from '@dhis2/d2-i18n'
import { Button, SharingDialog } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const InterpretationSharingLink = ({ type, id }) => {
    const [showSharingDialog, setShowSharingDialog] = useState(false)
    return (
        <>
            <div className="container">
                <Button
                    secondary
                    small
                    onClick={() => setShowSharingDialog(true)}
                >
                    {i18n.t('Manage sharing')}
                </Button>
            </div>
            {showSharingDialog && (
                <SharingDialog
                    open={true}
                    type={type}
                    id={id}
                    onClose={() => setShowSharingDialog(false)}
                />
            )}
            <style jsx>{`
                .container {
                    margin-inline-start: auto;
                }
            `}</style>
        </>
    )
}

InterpretationSharingLink.propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
}

export { InterpretationSharingLink }
