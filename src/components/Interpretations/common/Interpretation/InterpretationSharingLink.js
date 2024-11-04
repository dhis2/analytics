import i18n from '@dhis2/d2-i18n'
import { SharingDialog, colors, spacers } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'

const InterpretationSharingLink = ({ type, id }) => {
    const [showSharingDialog, setShowSharingDialog] = useState(false)
    return (
        <>
            <div className="container">
                <span
                    className="link"
                    onClick={() => setShowSharingDialog(true)}
                >
                    {i18n.t('Manage sharing')}
                </span>
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
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: ${spacers.dp4};
                    margin-top: ${spacers.dp8};
                    font-size: 13px;
                    color: ${colors.grey800};
                    cursor: pointer;
                }

                .link {
                    text-decoration: underline;
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
