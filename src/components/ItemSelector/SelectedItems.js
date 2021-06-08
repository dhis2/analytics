import { Button, IconInfo16, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import i18n from '../../locales/index.js'
import { reorderList } from './modules/reorderList'
import { toggler } from './modules/toggler'
import styles from './styles/SelectedItems.style'
import { ArrowButton as UnAssignButton } from './widgets/ArrowButton'
import Item from './widgets/SelectedItem'

const Subtitle = () => (
    <div className="subtitle-container">
        <span className="subtitle-text">{i18n.t('Selected Data')}</span>
        <style jsx>{styles}</style>
    </div>
)

const InfoBox = ({ message, dataTest }) => (
    <div className="info-container" data-test={dataTest}>
        <IconInfo16 color={colors.grey600} />
        <span className="info-text">{message}</span>
        <style jsx>{styles}</style>
    </div>
)

const ItemsList = ({ innerRef, children, dataTest }) => (
    <ul className="selected-list" ref={innerRef} data-test={dataTest}>
        {children}
        <style jsx>{styles}</style>
    </ul>
)

const CLONE_INDEX = 9999 // a high number to not influence the actual item list

export class SelectedItems extends Component {
    state = { highlighted: [], lastClickedIndex: 0, draggingId: null }

    onDeselectHighlighted = () => {
        this.props.onDeselect(this.state.highlighted)
        this.setState({ highlighted: [] })
    }

    onDeselectOne = id => {
        const highlighted = this.state.highlighted.filter(
            highlightedId => highlightedId !== id
        )

        this.props.onDeselect([id])
        this.setState({ highlighted })
    }

    onDeselectAll = () => {
        this.props.onDeselect(this.props.items.map(item => item.id))
        this.setState({ highlighted: [] })
    }

    toggleHighlight = ({ isCtrlPressed, isShiftPressed, index, id }) => {
        const newState = toggler({
            id,
            isCtrlPressed,
            isShiftPressed,
            index,
            lastClickedIndex: this.state.lastClickedIndex,
            highlightedIds: this.state.highlighted,
            items: this.props.items.map(item => item.id),
        })

        this.setState({
            highlighted: newState.ids,
            lastClickedIndex: newState.lastClickedIndex,
        })
    }

    isMultiDrag = draggableId => {
        return (
            this.state.highlighted.includes(draggableId) &&
            this.state.highlighted.length > 1
        )
    }

    onDragStart = start => {
        const id = start.draggableId
        const selected = this.state.highlighted.find(itemId => itemId === id)

        // if dragging an item that is not highlighted, unhighlight all items
        if (!selected) {
            this.setState({ highlighted: [] })
        }

        this.setState({ draggingId: start.draggableId })
    }

    onDragEnd = ({ destination, source, draggableId }) => {
        this.setState({ draggingId: null })

        if (destination === null) {
            return
        }

        if (
            destination.draggableId === source.draggableId &&
            destination.index === source.index
        ) {
            return
        }

        const newList = reorderList({
            destinationIndex: destination.index,
            sourceIndex: source.index,
            draggableId,
            isMultiDrag: this.isMultiDrag(draggableId),
            items: this.props.items,
            highlightedItemIds: this.state.highlighted,
        })

        this.props.onReorder(newList)
    }

    renderListItem = ({ id, name, isActive }, index) => (
        <Draggable draggableId={id} index={index} key={id}>
            {(provided, snapshot) => {
                const isDraggedItem =
                    snapshot.isDragging &&
                    this.state.highlighted.length > 1 &&
                    this.state.highlighted.includes(this.state.draggingId)

                const ghost =
                    this.state.highlighted.includes(id) &&
                    Boolean(this.state.draggingId) &&
                    this.state.draggingId !== id

                const itemText = isDraggedItem
                    ? `${this.state.highlighted.length} items`
                    : name

                return (
                    <li
                        className="selected-list-item"
                        id={id}
                        onDoubleClick={() => this.onDeselectOne(id)}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        data-test={`${this.props.dataTest}-list-item`}
                    >
                        <Item
                            id={id}
                            index={index}
                            name={itemText}
                            highlighted={!!this.state.highlighted.includes(id)}
                            active={isActive}
                            onRemoveItem={this.onDeselectOne}
                            onClick={this.toggleHighlight}
                            ghost={ghost}
                        />
                        <style jsx>{styles}</style>
                    </li>
                )
            }}
        </Draggable>
    )

    renderCloneItem = ({ id, name }, index) => {
        const cloneId = `${id}-clone`
        return (
            <Draggable draggableId={cloneId} index={index} key={cloneId}>
                {provided => (
                    <li
                        className="selected-list-item"
                        id={cloneId}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <Item
                            id={cloneId}
                            index={CLONE_INDEX}
                            name={name}
                            highlighted={!!this.state.highlighted.includes(id)}
                            selected
                            ghost
                        />
                        <style jsx>{styles}</style>
                    </li>
                )}
            </Draggable>
        )
    }

    getItemListWithClone = () => {
        const list = []

        this.props.items.forEach(item => {
            list.push(item)

            const isDraggedItem =
                this.isMultiDrag(this.state.draggingId) &&
                this.state.draggingId === item.id

            if (isDraggedItem) {
                list.push({
                    id: item.id,
                    name: item.name,
                    isActive: item.isActive,
                    clone: true,
                })
            }
        })

        return list
    }

    render = () => {
        const itemList = this.getItemListWithClone().map((item, i) =>
            item.clone
                ? this.renderCloneItem(item, i)
                : this.renderListItem(item, i)
        )

        return (
            <Fragment>
                <Subtitle />
                {this.props.infoBoxMessage ? (
                    <InfoBox
                        message={this.props.infoBoxMessage}
                        dataTest={`${this.props.dataTest}-info-box`}
                    />
                ) : null}
                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    <Droppable droppableId="selected-items-droppable">
                        {provided => (
                            <ItemsList
                                innerRef={provided.innerRef}
                                dataTest={`${this.props.dataTest}-list`}
                                {...provided.droppableProps}
                            >
                                {itemList}
                                {provided.placeholder}
                            </ItemsList>
                        )}
                    </Droppable>
                </DragDropContext>
                <div className="deselect-all-button">
                    <Button
                        onClick={this.onDeselectAll}
                        dataTest={`${this.props.dataTest}-deselect-all-button`}
                    >
                        {i18n.t('Deselect All')}
                    </Button>
                </div>
                <div className="deselect-highlighted-button">
                    <UnAssignButton
                        onClick={this.onDeselectHighlighted}
                        iconType={'arrowBack'}
                    />
                </div>
                <style jsx>{styles}</style>
            </Fragment>
        )
    }
}

InfoBox.propTypes = {
    dataTest: PropTypes.string,
    message: PropTypes.string,
}

ItemsList.propTypes = {
    children: PropTypes.array,
    dataTest: PropTypes.string,
    innerRef: PropTypes.func,
}

SelectedItems.propTypes = {
    items: PropTypes.array.isRequired,
    onDeselect: PropTypes.func.isRequired,
    onReorder: PropTypes.func.isRequired,
    dataTest: PropTypes.string,
    infoBoxMessage: PropTypes.string,
}

export default SelectedItems
