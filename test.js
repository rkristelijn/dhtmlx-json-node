'onAfterCMove', //fires after the column has been moved to a new position
'onAfterRowDeleted', //fires after a row has been deleted from the grid
'onAfterSorting', //fires exactly after sorting has occured in the grid
'onBeforeBlockSelected', //fires when the user starts selecting a block
'onBeforeCMove', //fires when a column moving operation starts
'onBeforeContextMenu', //fires immediately before showing a context menu
'onBeforeDrag', //fires when the drag operation starts
'onBeforeFormSubmit', //fires before submitting data to the form
'onBeforePageChanged', //fires before the active page in the grid is changed (paging extension)
'onBeforeRowDeleted', //fires right before a row is deleted
'onBeforeSelect', //fires a moment before a row in the grid is selected
'onBeforeSorting', //fires before data sorting is started
'onBlockRightClick', //fires after clicking by the right mouse button on the selection block
'onBlockSelected', //fires when some area is selected in the grid (block selection extension)
'onCalendarShow', //fires when a calendar pops up in the grid
'onCellChanged', //fires when a cell value has been changed by user actions or by API calls ( )
'onCellMarked', //fires immediately after a cell has been selected
'onCellUnMarked', //fires immediately after a cell is unselected
'onCheck', //fires after the state of a checkbox has been changed
'onCheckbox', //the event is deprecated, use the onCheck event instead; fires after the state was changed
'onClearAll', //fires when the grid is cleared (reloaded)
'onCollectValues', //fires after the values have been collected to fill the select filter
'onColumnCollapse', //the event occurs after a group of columns has been collapsed
'onColumnHidden', //fires after a column has been hidden (the setColumnHidden method has been called)
'onDataReady', //fires when the data is loaded to the grid but hasn't been rendered yet
'onDhxCalendarCreated', //fires on calendar's initialization on the page
'onDistributedEnd', //fires on the end of distributed parsing
'onDrag', //fires when an item is dragged to another target and the mouse is released, the event can be blocked
'onDragIn', //fires when an item is dragged to a potential target (the event can be blocked)
'onDragOut', //fires when an item is dragged out of the potential target (the event can be blocked)
'onDrop', //fires when an item is already placed in its final position
'onDynXLS', //fires before requesting additional data from the server in case of dynamic Smart Rendering or dynamic Paging
'onEditCancel', //fires when the edit operation was canceled
'onEditCell', //fires 1-3 times depending on cell's editability (see the stage parameter)
'onEmptyClick', //fires on clicking the dhtmlxgrid area which is not filled with data
'onEnter', //fires immediately after the Enter key was pressed
'onFilterEnd', //fires when filtering is completed (filtering extension)
'onFilterStart', //fires when filtering has been activated but before the real filtering started
'onGridReconstructed', //fires immediately after a row has been added/deleted or the grid has been reordered
'onGroup', //fires when a grid was grouped by some column
'onGroupClick', //fires on clicking a group row (can be blocked)
'onGroupStateChanged', //fires when a group was opened/closed
'onHeaderClick', //fires right after the header has been clicked, before sorting or any other actions
'onKeyPress', //fires after a key has been pressed but before the default key processing starts
'onLastRow', //fires on pressing the Down-Arrow button while the last row of the page is selected
'onLiveValidationCorrect', //fires when validation runs successfully
'onLiveValidationError', //fires when validation runs and rules execution are failed
'onMouseOver', //fires when the mouse pointer is moved over a cell
'onPageChanged', //fires after the active page of the grid has been changed (paging extension)
'onPaging', //fires each time when paging settings are changed (paging extension)
'onResize', //fires on each resize iteration
'onResizeEnd', //fires when resizing of a column is finished
'onRightClick', //fires immediately after the right mouse button has been clicked on a grid's row
'onRowAdded', //fires right after a row has been added to the grid
'onRowCreated', //fires after a row has been created in the grid and filled with data
'onRowDblClicked', //fires right after a row has been double clicked, before a cell editor is opened by a dbl click
'onRowHide', //fires when the row is hiding
'onRowIdChange', //fires after the ID of a row has been changed (changeRowId, setRowId, dataprocessor)
'onRowInserted', //fires when the row is added to the grid and filled with data
'onRowPaste', //fires for each row pasted from the clipboard (block selection extension)
'onRowSelect', //fires immediately after a row in the grid has been clicked
'onScroll', //fires immediately after scrolling has occured
'onSelectStateChanged', //fires immediately when the selection state has been changed
'onStatReady', //fires after the stat values have been calculated
'onSubAjaxLoad', //fires when sub-row-ajax cell loads its data
'onSubGridCreated', //fires when the creation of a sub-grid was initialized (can be blocked)
'onSubRowOpen', //fires when a sub-row(sub-grid) was opened/closed
'onSyncApply', //fires when data synchronization is finished
'onTab', //fires during the tabulation in the grid, blockable
'onUndo', //fires after the undo operation is implemented
'onUnGroup', //fires when the grid was ungrouped
'onValidationCorrect', //fires when validation runs successfully
'onValidationError', //fires when validation runs and rules execution are failed
'onXLE', //fires simultaneously with ending XML parsing, new items are already available in the grid
'onXLS', //fires before sending the request for a new XML to the server
