// allow form to be centered within a cell
dhtmlXForm.prototype.centerForm = function () {
  this.cont.parentNode.style.overflow = "auto";
  this.cont.style.height = "auto";
  this.cont.style.overflow = "hidden";
  this.cont.style.marginLeft = "0px";
  this.cont.style.marginBottom = "20px";
  this.cont.style.width = "100%";
  var w1 = this.cont.offsetWidth;
  this.cont.style.width = "auto";
  this.cont.style.marginLeft = Math.max(0, Math.round(w1 / 2 - this.cont.offsetWidth / 2)) + "px";
  t = null;
};

// common app settings
var A = {
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
  var deviceOrient = (window.orientation == 0 || window.orientation == 180 ? "portrait" : "landscape");
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
var mainSidebar;
var mainToolbar;

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
      { type: "button", id: "save", img: "save.png" }
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
var contactsGrid;
var contactsLayout;
var contactsForm;

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
    contactsGrid.enableEditEvents(true,true,true);
    contactsGrid.init();
    contactsGrid.load("api/contacts?type=" + A.deviceType, function () {
      contactsGrid.selectRow(0, true);
    }, "json");

    attachDp(contactsGrid);
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
      { type: "input", name: "info", label: "Additional info" }
    ]);
    contactsForm.setSizes = contactsForm.centerForm;
    contactsForm.setSizes();
  }
}

/// PROJECTS
var projectsGrid;
var projectsLayout;
var projectsTabbar;
var projectsChart;
var projectsChartId;
var projectsForm;

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
      { type: "input", name: "info", label: "Additional info" }
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
  }
}

function updateChart(id) {
  if (projectsTabbar.getActiveTab() != "stats") return;
  if (id == null) id = projectsGrid.getSelectedRowId();
  if (id == projectsChartId || id == null) return;
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
  projectsChart.load(A.server + "chart/" + id + ".json?r=" + new Date().getTime(), "json");
  // remember loaded project
  projectsChartId = id;
}

function projectsFillForm(id) {
  // update form
  var data = projectsForm.getFormData();
  for (var a in data) {
    var index = projectsGrid.getColIndexById(a);
    if (index != null && index >= 0) data[a] = String(projectsGrid.cells(id, index).getValue()).replace(/\&amp;?/gi, "&");
  }
  projectsForm.setFormData(data);
  // update chart
  updateChart(id);
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
  if (id == "projects") projectsInit(cell);
});

/// EVENTS
var eventsDataView;
var eventsLayout;
var eventsMap;

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
  }
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
  if (id == "events") eventsInit(cell);
});

/// SETTINGS
var settingsDataView;
var settingsLayout;
var settingsForm;

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
      // attach form
      var formData = [];
      formData.push({ type: "settings", position: "label-left", labelWidth: 110, inputWidth: 160 });
      formData = formData.concat(settingsFormStruct[id]);
      settingsForm = settingsLayout.cells("b").attachForm(formData);
      settingsForm.setSizes = settingsForm.centerForm;
      settingsForm.setSizes();
    });

    // load the data, somehow a callback doesn't work
    settingsDataView.load("/api/settings", "json");

    // fires when the data loading is finished and a component or data is rendered
    settingsDataView.attachEvent("onXLE", function () {
      settingsDataView.select("contacts");
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
  var data = contactsForm.getFormData();
  for (var a in data) {
    var index = contactsGrid.getColIndexById(a);
    if (index != null && index >= 0) data[a] = String(contactsGrid.cells(id, index).getValue()).replace(/\&amp;?/gi, "&");
  }
  contactsForm.setFormData(data);
  // change photo
  var img = contactsGrid.cells(id, contactsGrid.getColIndexById("photo")).getValue(); // <img src=....>
  var src = img.match(/src=\"([^\"]*)\"/)[1];
  contactsForm.getContainer("photo").innerHTML = "<img src='imgs/contacts/big/" + src.match(/[^\/]*$/)[0] + "' border='0' class='form_photo'>";
}

function contactsGridBold(r, index) {
  contactsGrid.setCellTextStyle(contactsGrid.getRowId(index), contactsGrid.getColIndexById("name"), "font-weight:bold;border-left-width:0px;");
  contactsGrid.setCellTextStyle(contactsGrid.getRowId(index), contactsGrid.getColIndexById("photo"), "border-right-width:0px;");
}

window.dhx4.attachEvent("onSidebarSelect", function (id, cell) {
  if (id == "contacts") contactsInit(cell);
});
