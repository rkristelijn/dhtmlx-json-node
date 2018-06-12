function attachDpGrid(obj, objectName) {
  //fires after a row has been deleted from the grid
  obj.attachEvent('onAfterRowDeleted', (id, pid) => {
    console.log(objectName, 'onAfterRowDeleted', id, pid);
    fetch(`/api/contacts/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    })
      .then(response => {
        console.log(objectName, 'response', response.statusText);
      })
      .catch(err => { console.error(err) });
  });
  //fires when the user starts selecting a block
  obj.attachEvent('onBeforeBlockSelected', (rId, cInd) => {
    console.log(objectName, 'onBeforeBlockSelected', rId, cInd);
  });
  //fires when the drag operation starts
  obj.attachEvent('onBeforeDrag', (id) => {
    console.log(objectName, 'onBeforeDrag', id);
  });
  //fires right before a row is deleted
  obj.attachEvent('onBeforeRowDeleted', (rId) => {
    console.log(objectName, 'onBeforeRowDeleted', rId);
  });
  //fires after clicking by the right mouse button on the selection block
  obj.attachEvent('onBlockRightClick', (block, object) => {
    console.log(objectName, 'onBlockRightClick', block, object);
  });
  //fires when a calendar pops up in the grid
  obj.attachEvent('onCalendarShow', (myCal, rowId, colInd) => {
    console.log(objectName, 'onCalendarShow', myCal, rowId, colInd);
  });
  //fires immediately after a cell has been selected
  obj.attachEvent('onCellMarked', (rId, ind) => {
    console.log(objectName, 'onCellMarked', rId, ind);
  });
  //fires immediately after a cell is unselected
  obj.attachEvent('onCellUnMarked', (rId, ind) => {
    console.log(objectName, 'onCellUnMarked', rId, ind);
  });
  //fires after the state of a checkbox has been changed
  obj.attachEvent('onCheck', (rId, cInd, state) => {
    console.log(objectName, 'onCheck', rId, cInd, state);
  });
  //the event is deprecated, use the onCheck event instead; fires after the state was changed
  // obj.attachEvent('onCheckbox', (rId, cInd, state) => {
  //   console.log(objectName,'onCheckbox', rId, cInd, state);
  // });
  //fires when the grid is cleared (reloaded)
  obj.attachEvent('onClearAll', () => {
    console.log(objectName, 'onClearAll');
  });
  //fires after the values have been collected to fill the select filter
  obj.attachEvent('onCollectValues', (index) => {
    console.log(objectName, 'onCollectValues', index);
    return true; //mandatory for the default processing
  });
  //fires when the data is loaded to the grid but hasn't been rendered yet
  obj.attachEvent('onDataReady', () => {
    console.log(objectName, 'onDataReady');
  });
  //fires on calendar's initialization on the page
  obj.attachEvent('onDhxCalendarCreated', (myCal) => {
    console.log(objectName, 'onDhxCalendarCreated', myCal);
  });
  //fires on the end of distributed parsing
  obj.attachEvent('onDistributedEnd', () => {
    console.log(objectName, 'onDistributedEnd');
  });
  //fires when an item is dragged to another target and the mouse is released, the event can be blocked
  obj.attachEvent('onDrag', (sId, tId, sObj, tObj, sInd, tInd) => {
    console.log(objectName, 'onDrag', sId, tId, sObj, tObj, sInd, tInd);
  });
  //fires before requesting additional data from the server in case of dynamic Smart Rendering or dynamic Paging
  obj.attachEvent('onDynXLS', (start, count) => {
    console.log(objectName, 'onDynXLS', start, count);
  });
  //fires when the edit operation was canceled
  obj.attachEvent('onEditCancel', (rowId, colInd, value) => {
    console.log(objectName, 'onEditCancel', rowId, colInd, value);
  });
  //fires 1-3 times depending on cell's editability (see the stage parameter)
  obj.attachEvent('onEditCell', (stage, rowId, colIndex, newValue, oldValue) => {
    //stage the stage of editing (0-before start; can be canceled if return false,1 - the editor is opened,2- the editor is closed)
    const beforeStart = 0;
    const editorOpened = 1;
    const editorClosed = 2;

    if (stage === editorClosed & newValue !== oldValue) {
      let fieldName = obj.getColumnId(colIndex);
      let request = `{"${fieldName}":"${newValue}"}`;
      console.log(objectName, 'request', JSON.parse(request));
      fetch(`/api/contacts/${rowId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: request
      })
        .then(response => response.json())
        .then(response => {
          console.log(objectName, 'response', response);
        })
        .catch(err => { console.error(err) });

      return true;
    }
  });
  //fires on clicking the dhtmlxgrid area which is not filled with data
  // obj.attachEvent('onEmptyClick', (ev) => {
  //   console.log(objectName,'onEmptyClick', ev);
  // });
  //fires immediately after the Enter key was pressed
  obj.attachEvent('onEnter', (id, ind) => {
    console.log(objectName, 'onEnter', id, ind);
  });
  //fires when filtering is completed (filtering extension)
  obj.attachEvent('onFilterEnd', (elements) => {
    console.log(objectName, 'onFilterEnd', elements);
  });
  //fires when filtering has been activated but before the real filtering started
  obj.attachEvent('onFilterStart', (indexes, values) => {
    console.log(objectName, 'onFilterStart', indexes, values);
    return true; //The event is blockable. Returning false will block the default action. returning true will confirm filtering
  });
  //fires immediately after a row has been added/deleted or the grid has been reordered
  obj.attachEvent('onGridReconstructed', (obj) => {
    console.log(objectName, 'onGridReconstructed', obj);
  });
  //fires when a grid was grouped by some column
  obj.attachEvent('onGroup', () => {
    console.log(objectName, 'onGroup');
  });
  //fires when a group was opened/closed
  obj.attachEvent('onGroupStateChanged', (value, state) => {
    console.log(objectName, 'onGroupStateChanged', value, state);
  });
  //fires on pressing the Down-Arrow button while the last row of the page is selected
  obj.attachEvent('onLastRow', () => {
    console.log(objectName, 'onLastRow');
  });
  //fires when validation runs successfully
  obj.attachEvent('onLiveValidationCorrect', (id, index, value, input, rule) => {
    console.log(objectName, 'onLiveValidationCorrect', id, index, value, input, rule);
  });
  //fires when validation runs and rules execution are failed
  obj.attachEvent('onLiveValidationError', (id, index, value, input, rule) => {
    console.log(objectName, 'onLiveValidationError', id, index, value, input, rule);
  });
  //fires when the mouse pointer is moved over a cell
  // obj.attachEvent('onMouseOver', (id, ind) => {
  //   console.log(objectName,'onMouseOver', id, ind);
  // });
  //fires on each resize iteration
  obj.attachEvent('onResize', (cInd, cWidth, obj) => {
    console.log(objectName, 'onResize', cInd, cWidth, obj);
  });
  //fires when resizing of a column is finished
  obj.attachEvent('onResizeEnd', (obj) => {
    console.log(objectName, 'onResizeEnd', obj);
  });
  //fires immediately after the right mouse button has been clicked on a grid's row
  obj.attachEvent('onRightClick', (id, ind, obj) => {
    console.log(objectName, 'onRightClick', id, ind, obj);
  });
  //fires right after a row has been added to the grid
  obj.attachEvent('onRowAdded', (rId) => {
    console.log(objectName, 'onRowAdded', rId);
    fetch(`/api/contacts/`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(response => response.json())
      .then(response => {
        console.log(objectName, 'response', response);
        obj.callEvent("onAfterRowAdded", [rId, response._id]);
      })
      .catch(err => { console.error(err) });
  });
  //fires when the row is hiding
  obj.attachEvent('onRowHide', (id, state) => {
    console.log(objectName, 'onRowHide', id, state);
  });
  //fires after the ID of a row has been changed (changeRowId, setRowId, dataprocessor)
  obj.attachEvent('onRowIdChange', (oldId, newId) => {
    console.log(objectName, 'onRowIdChange', oldId, newId);
  });
  //fires when the row is added to the grid and filled with data
  // obj.attachEvent('onRowInserted', (row, rInd) => {
  //   console.log(objectName, 'onRowInserted', row, rInd);
  // });
  //fires for each row pasted from the clipboard (block selection extension)
  obj.attachEvent('onRowPaste', (rId) => {
    console.log(objectName, 'onRowPaste', rId);
  });
  //fires immediately after a row in the grid has been clicked
  obj.attachEvent('onRowSelect', (id, ind) => {
    console.log(objectName, 'onRowSelect', id, ind);
  });
  //fires immediately after scrolling has occured
  // obj.attachEvent('onScroll', (sLeft, sTop) => {
  //   console.log(objectName, 'onScroll', sLeft, sTop);
  // });
  //fires immediately when the selection state has been changed
  // obj.attachEvent('onSelectStateChanged', (id) => {
  //   console.log(objectName, 'onSelectStateChanged', id);
  // });
  //fires after the stat values have been calculated
  obj.attachEvent('onStatReady', () => {
    console.log(objectName, 'onStatReady');
  });
  //fires when sub-row-ajax cell loads its data
  obj.attachEvent('onSubAjaxLoad', (id, content) => {
    console.log(objectName, 'onSubAjaxLoad', id, content);
  });
  //fires when the creation of a sub-grid was initialized (can be blocked)
  obj.attachEvent('onSubGridCreated', (obj, rowId, rowIndex) => {
    console.log(objectName, 'onSubGridCreated', obj, rowId, rowIndex);
    return true;
  });
  //fires when a sub-row(sub-grid) was opened/closed
  obj.attachEvent('onSubRowOpen', (id, state) => {
    console.log(objectName, 'onSubRowOpen', id, state);
  });
  //fires when data synchronization is finished
  obj.attachEvent('onSyncApply', () => {
    console.log(objectName, 'onSyncApply');
  });
  //fires during the tabulation in the grid, blockable
  obj.attachEvent('onTab', (mode) => {
    console.log(objectName, 'onTab', mode);
  });
  //fires when the grid was ungrouped
  obj.attachEvent('onUnGroup', () => {
    console.log(objectName, 'onUnGroup');
  });
  //fires when validation runs successfully
  obj.attachEvent('onValidationCorrect', (id, index, value, rule) => {
    console.log(objectName, 'onValidationCorrect', id, index, value, rule);
  });
  //fires when validation runs and rules execution are failed
  obj.attachEvent('onValidationError', (id, index, value, rule) => {
    console.log(objectName, 'onValidationError', id, index, value, rule);
  });

  let eventsList = [
    //pro 'onAfterCMove', //fires after the column has been moved to a new position
    'onAfterRowDeleted', //fires after a row has been deleted from the grid
    //pro 'onAfterSorting', //fires exactly after sorting has occured in the grid
    'onBeforeBlockSelected', //fires when the user starts selecting a block
    //pro 'onBeforeCMove', //fires when a column moving operation starts
    //pro 'onBeforeContextMenu', //fires immediately before showing a context menu
    'onBeforeDrag', //fires when the drag operation starts
    //pro 'onBeforeFormSubmit', //fires before submitting data to the form
    //pro 'onBeforePageChanged', //fires before the active page in the grid is changed (paging extension)
    'onBeforeRowDeleted', //fires right before a row is deleted
    //pro 'onBeforeSelect', //fires a moment before a row in the grid is selected
    //pro 'onBeforeSorting', //fires before data sorting is started
    'onBlockRightClick', //fires after clicking by the right mouse button on the selection block
    //pro 'onBlockSelected', //fires when some area is selected in the grid (block selection extension)
    'onCalendarShow', //fires when a calendar pops up in the grid
    //pro 'onCellChanged', //fires when a cell value has been changed by user actions or by API calls ( )
    'onCellMarked', //fires immediately after a cell has been selected
    'onCellUnMarked', //fires immediately after a cell is unselected
    'onCheck', //fires after the state of a checkbox has been changed
    'onCheckbox', //the event is deprecated, use the onCheck event instead; fires after the state was changed
    'onClearAll', //fires when the grid is cleared (reloaded)
    'onCollectValues', //fires after the values have been collected to fill the select filter
    //pro 'onColumnCollapse', //the event occurs after a group of columns has been collapsed
    //pro 'onColumnHidden', //fires after a column has been hidden (the setColumnHidden method has been called)
    'onDataReady', //fires when the data is loaded to the grid but hasn't been rendered yet
    'onDhxCalendarCreated', //fires on calendar's initialization on the page
    'onDistributedEnd', //fires on the end of distributed parsing
    'onDrag', //fires when an item is dragged to another target and the mouse is released, the event can be blocked
    //pro 'onDragIn', //fires when an item is dragged to a potential target (the event can be blocked)
    //pro 'onDragOut', //fires when an item is dragged out of the potential target (the event can be blocked)
    //pro 'onDrop', //fires when an item is already placed in its final position
    'onDynXLS', //fires before requesting additional data from the server in case of dynamic Smart Rendering or dynamic Paging
    'onEditCancel', //fires when the edit operation was canceled
    'onEditCell', //fires 1-3 times depending on cell's editability (see the stage parameter)
    'onEmptyClick', //fires on clicking the dhtmlxgrid area which is not filled with data
    'onEnter', //fires immediately after the Enter key was pressed
    'onFilterEnd', //fires when filtering is completed (filtering extension)
    'onFilterStart', //fires when filtering has been activated but before the real filtering started
    'onGridReconstructed', //fires immediately after a row has been added/deleted or the grid has been reordered
    'onGroup', //fires when a grid was grouped by some column
    //pro 'onGroupClick', //fires on clicking a group row (can be blocked)
    'onGroupStateChanged', //fires when a group was opened/closed
    //pro 'onHeaderClick', //fires right after the header has been clicked, before sorting or any other actions
    //pro 'onKeyPress', //fires after a key has been pressed but before the default key processing starts
    'onLastRow', //fires on pressing the Down-Arrow button while the last row of the page is selected
    'onLiveValidationCorrect', //fires when validation runs successfully
    'onLiveValidationError', //fires when validation runs and rules execution are failed
    'onMouseOver', //fires when the mouse pointer is moved over a cell
    //pro 'onPageChanged', //fires after the active page of the grid has been changed (paging extension)
    //pro 'onPaging', //fires each time when paging settings are changed (paging extension)
    'onResize', //fires on each resize iteration
    'onResizeEnd', //fires when resizing of a column is finished
    'onRightClick', //fires immediately after the right mouse button has been clicked on a grid's row
    'onRowAdded', //fires right after a row has been added to the grid
    //pro 'onRowCreated', //fires after a row has been created in the grid and filled with data
    //pro 'onRowDblClicked', //fires right after a row has been double clicked, before a cell editor is opened by a dbl click
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
    //pro 'onUndo', //fires after the undo operation is implemented
    'onUnGroup', //fires when the grid was ungrouped
    'onValidationCorrect', //fires when validation runs successfully
    'onValidationError' //fires when validation runs and rules execution are failed
    //pro 'onXLE', //fires simultaneously with ending XML parsing, new items are already available in the grid
    //pro 'onXLS' //fires before sending the request for a new XML to the server
  ];
}
