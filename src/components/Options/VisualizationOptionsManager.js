import i18n from '@dhis2/d2-i18n'
import {
    ButtonStrip,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
//import styles from './styles/VisualizationOptionsManager.module.css'
import VisualizationOptions from './VisualizationOptions'

export class VisualizationOptionsManager extends Component {
    constructor(props) {
        super(props)

        this.state = {
            dialogIsOpen: false,
        }
    }

    onClose = () => {
        this.toggleVisualizationOptionsDialog()
    }

    toggleVisualizationOptionsDialog = () => {
        this.setState({ dialogIsOpen: !this.state.dialogIsOpen })
    }

    getPrimaryOnClick = handler => () => {
        handler()
        this.onClose()
    }

    render() {
        return (
            <Fragment>
                <button
                    //className={styles.menuButton}
                    data-test={'app-menubar-options-button'}
                    onClick={this.toggleVisualizationOptionsDialog}
                >
                    {i18n.t('Options')}
                </button>
                {this.state.dialogIsOpen && (
                    <Modal
                        onClose={this.onClose}
                        position="top"
                        large
                        dataTest={'options-modal'}
                    >
                        <ModalTitle>{i18n.t('Options')}</ModalTitle>
                        <ModalContent
                            //className={styles.modalContent}
                            dataTest={'options-modal-content'}
                        >
                            <VisualizationOptions
                                optionsConfig={this.props.optionsConfig}
                            />
                        </ModalContent>
                        <ModalActions dataTest={'options-modal-actions'}>
                            <ButtonStrip>
                                <Button
                                    type="button"
                                    secondary
                                    onClick={this.onClose}
                                    dataTest={'options-modal-action-cancel'}
                                >
                                    {i18n.t('Hide')}
                                </Button>
                                <Button
                                    onClick={this.getPrimaryOnClick()}
                                    dataTest={'options-modal-action-confirm'}
                                    type="button"
                                    primary
                                >
                                    {i18n.t('Update')}
                                </Button>
                            </ButtonStrip>
                        </ModalActions>
                    </Modal>
                )}
            </Fragment>
        )
    }
}

VisualizationOptionsManager.propTypes = {
    optionsConfig: PropTypes.array.isRequired,
}

export default VisualizationOptionsManager
