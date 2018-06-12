function attachDpGrid(obj, objectName, url) {
  //fires after a row has been deleted from the grid
  obj.attachEvent('onAfterRowDeleted', (id, pid) => {
    console.log(objectName, 'onAfterRowDeleted', id, pid);
    fetch(`${url}${id}`, {
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
      fetch(`${url}${rowId}`, {
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
  //fires right after a row has been added to the grid
  obj.attachEvent('onRowAdded', (rId) => {
    console.log(objectName, 'onRowAdded', rId);
    fetch(`${url}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(response => response.json())
      .then(response => {
        console.log(objectName, 'response', response);
        obj.callEvent("onAfterRowAdded", [rId, response._id, response]);
      })
      .catch(err => { console.error(err) });
  });
}
