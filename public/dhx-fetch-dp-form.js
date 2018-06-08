function attachDpForm(obj, objectName) {
  // onAfterReset	fires after resetting the form
  obj.attachEvent('onAfterReset', (formId) => {
    console.log(objectName, 'onAfterReset', formId);
  });
  // onAfterSave	fires after data has been saved in DB
  obj.attachEvent('onAfterSave', (formId, response) => {
    console.log(objectName, 'onAfterSave', formId, response);
  });
  // onAfterValidate	fires after the validation
  obj.attachEvent('onAfterValidate', (success) => {
    console.log(objectName, 'onAfterValidate', success);
  });
  // onBeforeChange	fires before the data in some input changed ( by user actions )
  obj.attachEvent('onBeforeChange', (itemName, oldValue, newValue) => {
    console.log(objectName, 'onBeforeChange', itemName, oldValue, newValue);
    return true;
  });
  // onBeforeClear	fires before the user clears the list of files to upload (clicks the button )
  obj.attachEvent('onBeforeClear', () => {
    console.log(objectName, 'onBeforeClear');
    return true;
  });
  // onBeforeDataLoad	fires after the data for the form received, but before it's assigned to actual fields
  obj.attachEvent('onBeforeDataLoad', (formId, values) => {
    console.log(objectName, 'onBeforeDataLoad', formId, values);
    return true;
  });
  // onBeforeFileAdd	fires when the user adds a file to the upload queue
  obj.attachEvent('onBeforeFileAdd', (fileName) => {
    console.log(objectName, 'onBeforeFileAdd', fileName);
    return true;
  });
  // onBeforeFileRemove	fires before the user removes a single file from the list of files to upload (clicks the button )
  obj.attachEvent('onBeforeFileRemove', (clientFileName, serverFileName) => {
    console.log(objectName, 'onBeforeFileRemove', clientFileName, serverFileName);
    return true;
  });
  // onBeforeFileUpload	fires before file uploading has started
  obj.attachEvent('onBeforeFileUpload', (mode, loader, formData) => {
    console.log(objectName, 'onBeforeFileUpload', mode, loader, formData);
    return true;
  });
  // onBeforeReset	fires before resetting the form
  obj.attachEvent('onBeforeReset', (formId, values) => {
    console.log(objectName, 'onBeforeReset', formId, values);
    return true;
  });
  // onBeforeSave	fires before saving the form
  obj.attachEvent('onBeforeSave', (formId, values) => {
    console.log(objectName, 'onBeforeSave', formId, values);
    return true;
  });
  // onBeforeValidate	fires when validation has started but is not applied yet
  obj.attachEvent('onBeforeValidate', (formId) => {
    console.log(objectName, 'onBeforeValidate', formId);
    return true;
  });
  // onBlur	fires when the user moves the mouse pointer out of the input
  // obj.attachEvent('onBlur', (itemName, value) => {
  //   // value: item value (for checkboxes and radios only)
  //   console.log(objectName, 'onBlur', itemName, value);
  // });
  // onButtonClick	fires when the user clicks a button
  obj.attachEvent('onButtonClick', (itemName) => {
    console.log(objectName, 'onButtonClick', itemName);
  });
  // onChange	fires when data in some input was changed
  obj.attachEvent('onChange', (itemName, value, state) => {
    //state = checked/unchecked (for checkboxes and radios only)
    console.log(objectName, 'onChange', itemName, value, state);
    let rowId = obj.getItemValue('id');
    let request = `{"${itemName}":"${value}"}`;
    console.log(objectName, 'request', JSON.parse(request), rowId);
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
        obj.callEvent("onAfterChange", [rowId, itemName, value]);
      })
      .catch(err => { console.error(err) });
  });
  // onClear	when the user clears the list of files to upload (clicks on button )
  obj.attachEvent('onClear', () => {
    console.log(objectName, 'onClear');
  });
  // onDisable	fires when the container is disabled after being enabled
  obj.attachEvent('onDisable', (itemName) => {
    console.log(objectName, 'onDisable', itemName);
  });
  // onEditorAccess	fires when the user accesses the editor body
  obj.attachEvent('onEditorAccess', (name, type, event, editor, form) => {
    // name	string	the item's name
    // type	string	the type of the accessing action (e.g. "mousedown","focus","mouseup","click", "blur")
    // ev	object	the event object
    // editor	object	the editor instance
    // form	object	the form instance
    console.log(objectName, 'onEditorAccess', name, type, event, editor, form);
  });
  // onEditorToolbarClick	fires when the user clicks the editor toolbar
  obj.attachEvent('onEditorToolbarClick', (name, toolbarId, editor, form) => {
    console.log(objectName, 'onEditorToolbarClick', name, toolbarId, editor, form);
  });
  // onEnable	fires when the container control is enabled after being disabled
  obj.attachEvent('onEnable', (itemName) => {
    console.log(objectName, 'onEnable', itemName);
  });
  // onEnter	fires on pressing the Enter button when the mouse pointer is set in an input control
  obj.attachEvent('onEnter', (itemName) => {
    console.log(objectName, 'onEnter', itemName);
  });
  // onFileAdd	fires when the user adds a file to the upload queue
  obj.attachEvent('onFileAdd', (fileName) => {
    console.log(objectName, 'onFileAdd', fileName);
  });
  // onFileRemove	fires when the user removes single file from the list of files to upload (clicks the button )
  obj.attachEvent('onFileRemove', (clientFileName, serverFileName) => {
    console.log(objectName, 'onFileRemove', clientFileName, serverFileName);
  });
  // onFocus	fires when an input gets focus
  // obj.attachEvent('onFocus', (itemName, value) => {
  //   // value: item value (for checkboxes and radios only)
  //   console.log(objectName, 'onFocus', itemName, value);
  // });
  // onImageUploadFail	fires when an image was uploaded incorrectly
  obj.attachEvent('onImageUploadFail', (itemName, extra) => {
    console.log(objectName, 'onImageUploadFail', itemName, extra);
  });
  // onImageUploadSuccess	fires when an image was uploaded correctly
  obj.attachEvent('onImageUploadSuccess', (itemName, imageName, extra) => {
    console.log(objectName, 'onImageUploadSuccess', itemName, imageName, extra);
  });
  // onInfo	fires when the user clicks the Info icon
  obj.attachEvent('onInfo', (itemName, event) => {
    console.log(objectName, 'onInfo', itemName, event);
  });
  // onInputChange	fires when data in an input was changed and the cursor is still in this input
  // obj.attachEvent('onInputChange', (itemName, value, form) => {
  //   console.log(objectName, 'onInputChange', itemName, value, form);
  // });
  // onKeydown	fires when the native "onkeydown" event is triggered
  // obj.attachEvent('onKeydown', (inputElement, eventObject, itemName, value) => {
  //   console.log(objectName, 'onKeydown', inputElement, eventObject, itemName, value);
  // });
  // onKeyup	fires when the native "onkeyup" event is triggered
  // obj.attachEvent('onKeyup', (inputElement, eventObject, itemName, value) => {
  //   console.log(objectName, 'onKeyup', inputElement, eventObject, itemName, value);
  // });
  // onOptionsLoaded	fires after the item options were completely loaded from the server to the client
  obj.attachEvent('onOptionsLoaded', (itemName) => {
    console.log(objectName, 'onOptionsLoaded', itemName);
  });
  // onUploadCancel	fires when the user cancels uploading of a file (clicks the button ).
  obj.attachEvent('onUploadCancel', (fileName) => {
    console.log(objectName, 'onUploadCancel', fileName);
  });
  // onUploadComplete	fires when all files from the list have been uploaded to the server
  obj.attachEvent('onUploadComplete', (count) => {
    console.log(objectName, 'onUploadComplete', count);
  });
  // onUploadFail	fires when the file upload has failed
  obj.attachEvent('onUploadFail', (fileName) => {
    //fileName the real name of the file (as it's displayed in the control)
    console.log(objectName, 'onUploadFail', fileName);
  });
  // onUploadFile	fires when a single file from the list has been uploaded to the server
  obj.attachEvent('onUploadFile', (clientFileName, serverFileName) => {
    console.log(objectName, 'onUploadFile', clientFileName, serverFileName);
  });
  // onValidateError	fires for each error during validation
  obj.attachEvent('onValidateError', (name, value, result) => {
    console.log(objectName, 'onValidateError', name, value, result);
  });
  // onValidateSuccess	fires for each success during validation
  obj.attachEvent('onValidateSuccess', (name, value, result) => {
    console.log(objectName, 'onValidateSuccess', name, value, result);
  });
  // onXLE	fires when the data loading is finished and a component or data is rendered
  obj.attachEvent('onXLE', () => {
    //callback order: onXLS event => [request] => onXLE event => doOnLoad()
    console.log(objectName, 'onXLE');
  });
  // onXLS	fires when XML loading started
  obj.attachEvent('onXLS', () => {
    //callback order: onXLS event => [request] => onXLE event => doOnLoad()
    console.log(objectName, 'onXLS');
  });
}
