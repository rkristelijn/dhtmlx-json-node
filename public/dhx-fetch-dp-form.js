function attachDpForm(obj, objectName, url) {
  // onChange	fires when data in some input was changed
  obj.attachEvent('onChange', (itemName, value, state) => {
    //state = checked/unchecked (for checkboxes and radios only)
    console.log(objectName, 'onChange', itemName, value, state);
    let rowId = obj.getItemValue('id');
    let request = `{"${itemName}":"${value}"}`;
    console.log(objectName, 'request', JSON.parse(request), rowId);
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
        obj.callEvent("onAfterChange", [rowId, itemName, value]);
      })
      .catch(err => { console.error(err) });
  });
}
