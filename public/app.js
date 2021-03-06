// allow form to be centered within a cell
dhtmlXForm.prototype.centerForm = function () {
  this.cont.parentNode.style.overflow = "auto";
  this.cont.style.height = "auto";
  this.cont.style.overflow = "hidden";
  this.cont.style.marginLeft = "0px";
  this.cont.style.marginBottom = "20px";
  this.cont.style.width = "100%";
  let w1 = this.cont.offsetWidth;
  this.cont.style.width = "auto";
  this.cont.style.marginLeft = Math.max(0, Math.round(w1 / 2 - this.cont.offsetWidth / 2)) + "px";
  t = null;
};

// common app settings
let A = {
  deviceOrient: (typeof (window.orientation) == "undefined" ? (window.innerWidth > window.innerHeight ? "landscape" : "portrait") : doOnRotate()),
  deviceType: (function (i) { return (i < 1024 ? "phone" : (i < 1280 ? "tablet" : "desktop")); })(Math.max(screen.width, screen.height)),
  server: "server/",
  cache: true,
  modules: {
    dhtmlx: ["dhtmlx", "dhtmlx_ext"],
    app: ["init", "contacts", "projects", "events", "settings"],
    common: ["settings_forms"]
  }
};

// app unload
function doOnUnload() {
  if (typeof (window.addEventListener) == "function") {
    window.removeEventListener("load", doOnLoad, false);
    window.removeEventListener("unload", doOnUnload, false);
    window.removeEventListener("orientationchange", doOnRotate, false);
  } else {
    window.detachEvent("onload", doOnLoad);
    window.detachEvent("onunload", doOnUnload);
  }
  window.dhx4.callEvent("unload", []);
};

// common rotate callback
function doOnRotate(e) {
  let deviceOrient = (window.orientation == 0 || window.orientation == 180 ? "portrait" : "landscape");
  if (typeof (e) == "undefined") return deviceOrient;
  if (A != null) A.deviceOrient = deviceOrient;
  window.dhx4.callEvent("onOrientationChange", [deviceOrient]);
};

// page-load event
if (typeof (window.addEventListener) == "function") {
  window.addEventListener("orientationchange", doOnRotate, false);
} else {
  window.attachEvent("onload", doOnLoad);
  window.attachEvent("onunload", doOnUnload);
}

//// # THE MAIN LAYOUT
let mainSidebar;
let mainToolbar;

function appInit() {
  mainSidebar = new dhtmlXSideBar({
    parent: document.body,
    icons_path: "imgs/sidebar/",
    width: 180,
    template: "tiles",
    items: [
      { id: "contacts", text: "Contacts", icon: "contacts.png" },
      { id: "projects", text: "Projects", icon: "projects.png" },
      { id: "events", text: "Events", icon: "events.png" },
      { id: "settings", text: "Settings", icon: "settings.png" }
    ]
  });

  mainToolbar = mainSidebar.attachToolbar({
    icons_size: 32,
    icons_path: "imgs/toolbar/",
    items: [
      { type: "text", id: "title", text: "&nbsp;" },
      { type: "spacer" },
      { type: "button", id: "add", img: "add.png" },
      { type: "button", id: "del", img: "del.png" }
    ]
  });

  mainSidebar.attachEvent("onSelect", function (id) {
    mainToolbar.setItemText("title", window.dhx4.template("<span style='font-weight: bold; font-size: 14px;'>#text#</span>", { text: mainSidebar.cells(id).getText().text }));
    window.dhx4.callEvent("onSidebarSelect", [id, this.cells(id)]);
  });

  // select 'Contacts' by default
  mainSidebar.cells("contacts").setActive(true);
}

function appUnload() {
  if (mainSidebar != null && mainSidebar.unload != null) {
    mainSidebar.unload();
    mainSidebar = null;
  }
}

window.addEventListener('load', appInit);
window.addEventListener('beforeunload', appUnload);

/// CONTACTS
let contactsGrid;
let contactsLayout;
let contactsForm;

function contactsInit(cell) {
  if (contactsLayout == null) {
    // init layout
    contactsLayout = cell.attachLayout("2U");
    contactsLayout.cells("a").hideHeader();
    contactsLayout.cells("b").hideHeader();
    contactsLayout.cells("b").setWidth(330);
    contactsLayout.cells("b").fixSize(true, true);
    contactsLayout.setAutoSize("a", "a;b");

    // attach grid
    contactsGrid = contactsLayout.cells("a").attachGrid();
    contactsGrid.enableEditEvents(true, true, true);
    contactsGrid.init();
    contactsGrid.load("api/contacts?type=" + A.deviceType, function () {
      contactsGrid.selectRow(0, true);
    }, "json");

    // attach custom data processor
    attachDpGrid(contactsGrid, 'contactsGrid', '/api/contacts/');

    // attach form
    contactsGrid.attachEvent("onRowSelect", contactsFillForm);
    contactsGrid.attachEvent("onRowInserted", contactsGridBold);

    contactsForm = contactsLayout.cells("b").attachForm([
      { type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160 },
      { type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65 },
      { type: "input", name: "name", label: "Name", offsetTop: 20 },
      { type: "input", name: "email", label: "E-mail" },
      { type: "input", name: "phone", label: "Phone" },
      { type: "input", name: "company", label: "Company" },
      { type: "input", name: "info", label: "Additional info" },
      { type: "input", name: "id", label: "RowId", attributes: ["readonly"], readonly: true }
    ]);

    // attach custom data processor
    attachDpForm(contactsForm, 'contactsForm', '/api/contacts/');
    contactsForm.setSizes = contactsForm.centerForm;
    contactsForm.setSizes();

    // attach custom event after change
    contactsForm.attachEvent("onAfterChange", (rowId, field, value) => {
      fieldIndex = contactsGrid.getColIndexById(field);
      contactsGrid.cells(rowId, fieldIndex).setValue(value);
    });

    // attach custom event after added
    contactsGrid.attachEvent("onAfterRowAdded", (tempRowId, serverRowId, values) => {
      contactsGrid.changeRowId(tempRowId, serverRowId);
      //pre-defaults, if any
      contactsGrid.cells(serverRowId, 0).setValue(values.photo);
    });

    mainToolbar.attachEvent("onClick", (buttonId) => {
      if (mainSidebar.getActiveItem() === 'contacts') {
        let rowId;
        switch (buttonId) {
          case "add":
            rowId = contactsGrid.uid();
            contactsGrid.addRow(rowId, "");
            contactsGrid.selectRowById(rowId);
            break;
          case "del":
            rowId = contactsGrid.getSelectedRowId();
            let rowIndex = contactsGrid.getRowIndex(rowId);
            contactsGrid.deleteRow(rowId);
            // highlight the next record, or the previous record when deleting the last line
            if (rowIndex < contactsGrid.getRowsNum()) {
              contactsGrid.selectRow(rowIndex, true);
            } else {
              contactsGrid.selectRow(rowIndex - 1, true)
            }
            break;
        }
      }
    });
  }
}

/// PROJECTS
let projectsGrid;
let projectsLayout;
let projectsTabbar;
let projectsChart;
let projectsChartId;
let projectsForm;

function projectsInit(cell) {
  if (projectsLayout == null) {

    // init layout
    projectsLayout = cell.attachLayout("3J");
    projectsLayout.cells("a").hideHeader();
    projectsLayout.cells("b").hideHeader();
    projectsLayout.cells("c").hideHeader();
    projectsLayout.cells("b").setWidth(330);
    projectsLayout.cells("c").setHeight(350);
    projectsLayout.cells("b").fixSize(true, true);
    projectsLayout.setAutoSize("a;c", "a;b");

    // attach grid
    projectsGrid = projectsLayout.cells("a").attachGrid();
    projectsGrid.enableEditEvents(true, true, true);
    projectsGrid.load("api/projects?type=" + A.deviceType, function () {
      projectsGrid.selectRow(0, true);
    }, "json");
    projectsGrid.attachEvent("onRowSelect", projectsFillForm);
    projectsGrid.attachEvent("onRowInserted", function (r, index) {
      projectsGrid.setCellTextStyle(projectsGrid.getRowId(index), projectsGrid.getColIndexById("project"), "font-weight:bold;");
    });

    // attach form
    projectsForm = projectsLayout.cells("b").attachForm([
      { type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160 },
      { type: "container", name: "photo", label: "", inputWidth: 160, inputHeight: 160, offsetTop: 20, offsetLeft: 65 },
      { type: "input", name: "due", label: "Due date", offsetTop: 20 },
      { type: "input", name: "project", label: "Project" },
      { type: "input", name: "status", label: "Status" },
      { type: "input", name: "assign", label: "Assigned to" },
      { type: "input", name: "info", label: "Additional info" },
      { type: "input", name: "id", label: "RowId", attributes: ["readonly"], readonly: true }
    ]);
    projectsForm.getContainer("photo").innerHTML = "<img src='imgs/projects/project.png' border='0' class='form_photo'>";
    projectsForm.setSizes = projectsForm.centerForm;
    projectsForm.setSizes();

    // attach tabbar
    projectsTabbar = projectsLayout.cells("c").attachTabbar({
      arrows_mode: "auto",
      tabs: [
        { id: "stats", text: "Stats", selected: 1 }
      ]
    });

    // connect the api
    attachDpGrid(projectsGrid, 'projectsGrid', '/api/projects/');
    attachDpForm(projectsForm, 'projectsForm', '/api/projects/');

    // attach custom event after change
    projectsForm.attachEvent("onAfterChange", (rowId, field, value) => {
      fieldIndex = projectsGrid.getColIndexById(field);
      projectsGrid.cells(rowId, fieldIndex).setValue(value);
    });

    // attach custom event after added
    projectsGrid.attachEvent("onAfterRowAdded", (tempRowId, serverRowId, values) => {
      projectsGrid.changeRowId(tempRowId, serverRowId);
    });

    // connect the events on the tabbar
    mainToolbar.attachEvent("onClick", (buttonId) => {
      if (mainSidebar.getActiveItem() === 'projects') {
        let rowId;
        switch (buttonId) {
          case "add":
            rowId = projectsGrid.uid();
            projectsGrid.addRow(rowId, "");
            projectsGrid.selectRowById(rowId);
            break;
          case "del":
            rowId = projectsGrid.getSelectedRowId();
            let rowIndex = projectsGrid.getRowIndex(rowId);
            projectsGrid.deleteRow(rowId);
            // highlight the next record, or the previous record when deleting the last line
            if (rowIndex < projectsGrid.getRowsNum()) {
              projectsGrid.selectRow(rowIndex, true);
            } else {
              projectsGrid.selectRow(rowIndex - 1, true)
            }
            break;
        }
      }
    });
  }
}

function updateChart(id) {
  if (projectsTabbar.getActiveTab() != "stats") return;
  if (id == null) id = projectsGrid.getSelectedRowId();
  if (id == projectsChartId || id == null) return;

  let name = projectsGrid.cells(id, 1).getValue();
  // init chart
  if (projectsChart == null) {
    projectsChart = projectsTabbar.tabs("stats").attachChart({
      view: "bar",
      value: "#sales#",
      gradient: "rising",
      radius: 0,
      legend: {
        width: 75,
        align: "right",
        valign: "middle",
        template: "#month#"
      }
    });
  } else {
    projectsChart.clearAll();
  }
  //projectsChart.load(A.server + "chart/" + id + ".json?r=" + new Date().getTime(), "json");
  projectsChart.load("api/projects/sales/" + name, "json");
  // remember loaded project
  projectsChartId = id;
}

function projectsFillForm(id) {
  // update form
  let data = projectsForm.getFormData();
  for (let a in data) {
    let index = projectsGrid.getColIndexById(a);
    if (index != null && index >= 0) data[a] = String(projectsGrid.cells(id, index).getValue()).replace(/\&amp;?/gi, "&");
  }
  data.id = id;
  projectsForm.setFormData(data);
  // update chart
  updateChart(id);
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
  if (id == "projects") projectsInit(cell);
});

/// EVENTS
let eventsDataView;
let eventsLayout;
let eventsMap;

function eventsInit(cell) {

  if (eventsLayout == null) {

    // init layout
    eventsLayout = cell.attachLayout("2U");
    eventsLayout.cells("a").hideHeader();
    eventsLayout.cells("b").hideHeader();
    eventsLayout.cells("b").setWidth(330);
    eventsLayout.cells("b").fixSize(true, true);
    eventsLayout.setAutoSize("a", "a;b");

    // attach data view
    eventsDataView = eventsLayout.cells("a").attachDataView({
      type: {
        template: "<div class='event_image'><img src='imgs/events/#image#' border='0' ondragstart='return false;'></div>" +
          "<div class='event_title'>#title#</div>" +
          "<div class='event_date'>#date#</div>" +
          "<div class='event_place'>#place#</div>",
        margin: 10,
        padding: 20,
        height: 300,
        width: 204
      },
      drag: false,
      select: true,
      edit: false
    });

    eventsDataView.load("api/events?type=" + A.deviceType, "json");

    // fires when the data loading is finished and a component or data is rendered
    eventsDataView.attachEvent("onXLE", function () {
      eventsDataView.select(eventsDataView.first());
    });
  }
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
  if (id == "events") eventsInit(cell);
});

/// SETTINGS
let settingsDataView;
let settingsLayout;
let settingsForm;

function settingsInit(cell) {

  if (settingsLayout == null) {

    // init layout
    settingsLayout = cell.attachLayout("2U");
    settingsLayout.cells("a").hideHeader();
    settingsLayout.cells("b").hideHeader();
    settingsLayout.cells("b").setWidth(330);
    settingsLayout.cells("b").fixSize(true, true);
    settingsLayout.setAutoSize("a", "a;b");

    // attach data view
    settingsDataView = settingsLayout.cells("a").attachDataView({
      type: {
        template: "<div style='position:relative;'>" +
          "<div class='settings_image'><img src='imgs/settings/#image#' border='0' ondragstart='return false;'></div>" +
          "<div class='settings_title'>#title#" +
          "<div class='settings_descr'>#descr#</div>" +
          "</div>" +
          "</div>",
        margin: 10,
        padding: 20,
        height: 120
      },
      autowidth: 2,
      drag: false,
      select: true,
      edit: false
    });

    settingsDataView.attachEvent("onAfterSelect", function (id) {
      //translate mongodb.id to name
      let setting = settingsDataView.get(id);
      let name = setting.name;

      // attach form
      let formData = [];
      formData.push({ type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160 });
      formData = formData.concat(settingsFormStruct[name]);
      settingsForm = settingsLayout.cells("b").attachForm(formData);
      settingsForm.setSizes = settingsForm.centerForm;
      settingsForm.setSizes();
    });

    // load the data, somehow a callback doesn't work
    settingsDataView.load("/api/settings", "json");

    // fires when the data loading is finished and a component or data is rendered
    settingsDataView.attachEvent("onXLE", function () {
      settingsDataView.select(settingsDataView.first());
    });

  }
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
  if (id == "settings") settingsInit(cell);
});

window.settingsFormStruct = {
  contacts: [
    { type: "label", label: "Contacts settings", labelWidth: "auto" },
    {
      type: "fieldset", width: 250, offsetTop: 10, label: "View", list: [
        { type: "settings", position: "label-right", labelWidth: "auto", inputWidth: "auto" },
        { type: "radio", name: "view", label: "Detailed", checked: true },
        { type: "newcolumn" },
        { type: "radio", name: "view", label: "Compact", offsetLeft: 15 }
      ]
    },
    {
      type: "fieldset", width: 250, offsetTop: 10, label: "Show fields", list: [
        { type: "checkbox", label: "Name", checked: true, inputWidth: "auto" },
        { type: "checkbox", label: "Date of Birth", checked: true },
        { type: "checkbox", label: "Position", checked: true },
        { type: "checkbox", label: "Email Address", checked: true },
        { type: "checkbox", label: "Phone", checked: true },
        { type: "checkbox", label: "Company", checked: true },
        { type: "checkbox", label: "Additional", checked: true }
      ]
    },
    {
      type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
        { type: "button", value: "Save" },
        { type: "newcolumn" },
        { type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5 }
      ]
    }
  ],
  events: [
    { type: "label", label: "Events", labelWidth: "auto" },
    {
      type: "fieldset", width: 250, offsetTop: 10, label: "View", list: [
        { type: "settings", position: "label-right", labelWidth: "auto", inputWidth: "auto" },
        { type: "radio", name: "view", label: "Detailed", checked: true },
        { type: "newcolumn" },
        { type: "radio", name: "view", label: "Compact", offsetLeft: 15 }
      ]
    },
    {
      type: "fieldset", width: 250, offsetTop: 10, label: "Show fields", list: [
        { type: "settings", labelWidth: 170, inputWidth: "auto" },
        { type: "checkbox", label: "All events", checked: true },
        { type: "checkbox", label: "Upcoming events in 1 month", checked: true },
        { type: "checkbox", label: "Upcoming events in 2 month", checked: true },
        { type: "checkbox", label: "Upcoming events in 3 month", checked: true }
      ]
    },
    {
      type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
        { type: "button", value: "Save" },
        { type: "newcolumn" },
        { type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5 }
      ]
    }
  ],
  projects: [
    { type: "label", label: "Projects settings", labelWidth: "auto" },
    {
      type: "fieldset", width: 250, offsetTop: 10, label: "View", list: [
        { type: "settings", position: "label-right", labelWidth: "auto", inputWidth: "auto" },
        { type: "radio", name: "view", label: "Detailed", checked: true },
        { type: "newcolumn" },
        { type: "radio", name: "view", label: "Compact", offsetLeft: 15 }
      ]
    },
    {
      type: "fieldset", width: 250, offsetTop: 10, label: "Show fields", list: [
        { type: "checkbox", label: "Due date", checked: true, inputWidth: "auto" },
        { type: "checkbox", label: "Project", checked: true },
        { type: "checkbox", label: "Status", checked: true },
        { type: "checkbox", label: "Assigned to", checked: true },
        { type: "checkbox", label: "Additional", checked: true }
      ]
    },
    {
      type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
        { type: "button", value: "Save" },
        { type: "newcolumn" },
        { type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5 }
      ]
    }
  ],
  configuration: [
    { type: "label", label: "Configuration", labelWidth: "auto" },
    {
      type: "block", width: 250, offsetTop: 10, blockOffset: 0, list: [
        { type: "settings", labelWidth: 120, inputWidth: 120 },
        { type: "input", label: "Full Name" },
        { type: "input", label: "Email Address" },
        { type: "input", label: "New Password" },
        { type: "input", label: "Repeat Password" }
      ]
    },
    {
      type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
        { type: "button", value: "Save" },
        { type: "newcolumn" },
        { type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5 }
      ]
    }
  ],
  exportprint: [
    { type: "label", label: "Export to PDF / Print", labelWidth: "auto" },
    {
      type: "block", width: "auto", offsetTop: 10, blockOffset: 0, list: [
        { type: "label", label: "<span style='font-weight:normal;color:black;'>Choose the page for export/print</span>", labelWidth: "auto" },
        {
          type: "combo", inputWidth: 220, options: [
            { text: "Contacts" }, { text: "Projects" }, { text: "Events" }
          ]
        }
      ]
    },
    {
      type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
        { type: "button", value: "Export" },
        { type: "newcolumn" },
        { type: "button", value: "Print", offsetLeft: 5 },
        { type: "newcolumn" },
        { type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5 }
      ]
    }
  ],
  notifications: [
    { type: "label", label: "Notifications", labelWidth: "auto" },
    {
      type: "fieldset", width: 250, offsetTop: 10, label: "Notify via emal when", list: [
        { type: "settings", labelWidth: 170, inputWidth: "auto" },
        { type: "checkbox", label: "Two weeks left before the due date of a project", checked: true },
        { type: "checkbox", label: "One week left before the due date of a project", checked: true },
        { type: "checkbox", label: "One day left before the due date of a project", checked: true },
        { type: "checkbox", label: "Two weeks left before an event", checked: true },
        { type: "checkbox", label: "One week left before an event", checked: true },
        { type: "checkbox", label: "One day left before an event", checked: true }
      ]
    },
    {
      type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
        { type: "button", value: "Save" },
        { type: "newcolumn" },
        { type: "button", value: "Cancel", className: "gray_btn", offsetLeft: 5 }
      ]
    }
  ],
  statistics: [
    { type: "label", label: "Export to PDF / Print", labelWidth: "auto" },
    {
      type: "block", width: "auto", offsetTop: 10, blockOffset: 0, list: [
        { type: "label", label: "<span style='font-weight:normal;color:black;'>Choose the data for displaying activity</span>", labelWidth: "auto" },
        {
          type: "combo", inputWidth: 220, options: [
            { text: "Contacts" }, { text: "Projects" }, { text: "Events" }
          ]
        }
      ]
    },
    {
      type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
        { type: "button", value: "Get statistic" }
      ]
    }
  ],
  removeworkspace: [
    { type: "label", label: "Remove your workspace", labelWidth: "auto" },
    {
      type: "block", width: "auto", offsetTop: 10, blockOffset: 0, list: [
        { type: "label", label: "<span style='font-weight:normal;color:black;'>You won't be able to restore the data.<br>  Are you sure?</span>", labelWidth: "auto" }
      ]
    },
    {
      type: "block", width: "auto", blockOffset: 0, offsetTop: 10, list: [
        { type: "button", value: "Pretty Sure!" },
        { type: "newcolumn" },
        { type: "button", value: "Ooops", className: "gray_btn", offsetLeft: 5 }
      ]
    }
  ]
};

/// COMMON
function contactsFillForm(id) {
  // update form
  let data = contactsForm.getFormData();
  for (let a in data) {
    let index = contactsGrid.getColIndexById(a);
    if (index != null && index >= 0) data[a] = String(contactsGrid.cells(id, index).getValue()).replace(/\&amp;?/gi, "&");
  }
  data.id = id;
  contactsForm.setFormData(data);
  // change photo
  let img = contactsGrid.cells(id, contactsGrid.getColIndexById("photo")).getValue(); // <img src=....>
  let src = img.match(/src=\"([^\"]*)\"/)[1];
  contactsForm.getContainer("photo").innerHTML = "<img src='imgs/contacts/big/" + src.match(/[^\/]*$/)[0] + "' border='0' class='form_photo'>";
}

function contactsGridBold(r, index) {
  contactsGrid.setCellTextStyle(contactsGrid.getRowId(index), contactsGrid.getColIndexById("name"), "font-weight:bold;border-left-width:0px;");
  contactsGrid.setCellTextStyle(contactsGrid.getRowId(index), contactsGrid.getColIndexById("photo"), "border-right-width:0px;");
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
  if (id == "contacts") contactsInit(cell);
});

/// SERVER EVENTS
function attachDpForm(obj, objectName, url) {
  // onChange	fires when data in some input was changed
  obj.attachEvent('onChange', (itemName, value, state) => {
    //state = checked/unchecked (for checkboxes and radios only)
    let rowId = obj.getItemValue('id');
    let request = `{"${itemName}":"${value}"}`;
    fetch(`${url}${rowId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'PUT',
      body: request
    })
      .then(response => response.json())
      .then(response => {
        obj.callEvent("onAfterChange", [rowId, itemName, value]);
      })
  });
}

function attachDpGrid(obj, objectName, url) {
  //fires after a row has been deleted from the grid
  obj.attachEvent('onAfterRowDeleted', (id, pid) => {
    fetch(`${url}${id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'DELETE'
    })
      .then(response => {
      })
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
      fetch(`${url}${rowId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'PUT',
        body: request
      })
        .then(response => response.json())
        .then(response => {
        })

      return true;
    }
  });
  //fires right after a row has been added to the grid
  obj.attachEvent('onRowAdded', (rId) => {
    fetch(`${url}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
      .then(response => response.json())
      .then(response => {
        obj.callEvent("onAfterRowAdded", [rId, response._id, response]);
      })
  });
}
