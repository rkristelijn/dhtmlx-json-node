# dhtmlx-json-node

This is a short tutorial to set up dhtmlx (dhx) using only JSON and node/mongodb as a back-end and the REST API. Recently I followed the ['Your First App'](https://docs.dhtmlx.com/tutorials__first_app__index.html) tutorial and felt unsatisfied with what I've learned. So I decided to push a little harder and use a demo app ['CRM System'](https://dhtmlx.com/docs/products/demoApps/dhtmlxCRMSystem/index.html) as the base and create my own tutorial.

In this tutorial I consider: less is more, if we can use defaults, we should do it (default: index.html, index.js etc). Only use stuff if and when we need it. I try to follow the latest standards, like lambda's, HTML5, WCAG, OWASP, etc. Also I try to teach only once: the right way.

# Plan
  - [x] Step1: Create static html page in Node
  - [x] Step2: Get dhx up and running
  - [x] Step3: Initialize the layout, grid and form with static data
    - [ ] Step3a: Improve code
      - [ ] Step3a1: Fix xml to json
      - [ ] Step3a2: Remove statics from code, remove globals
      - [ ] ...
  - [ ] Create and connect REST API

# Step 1: Static node web server

Use npm to create a new `package.json` file:

`npm init`
- package name: (default)
- version: 0.0.1
- description: Basic application using dhtmlx, json, node, rest
- entry point: index.js
- test command: (empty)
- git repo: (default)
- keywords: dhtmlx, json, node, rest
- author: Remi Kristelijn
- licence: (default: ISC)
- Ok?: yes

Before we start coding, we need express as our middleware.

`npm i --save express`

This created the node_modules folder that we need to add to the .gitignore file:

`echo node_modules > .gitignore`

Then we create the entry point `index.js`

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.listen(3000, () => {
  console.log('listening on *:3000');
});
```
That is all you need to create a simple node app. You can either use `node .` to fire up your application and point your browser to `http://localhost:3000`

Let's save our work using `git add.`, `git commit -a -m "blablabla"` and `git push`

# Step 2: Get dhx up and running

Instead of sending a string, we will send a static html page.

A few notes; 
- as of August 2016 [dhx provides a CDN](https://dhtmlx.com/blog/support-updates-dhtmlx-cdn-new-snippet-tool/) so we don't have to download the javascript files.
- WCAG dictates a page should have a language

Create `index.html`:
```html
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" type="text/css" href="//cdn.dhtmlx.com/edge/dhtmlx.css">
  <script src="//cdn.dhtmlx.com/edge/dhtmlx.js"></script>
</head>

<body>
  <script type="text/javascript">
    dhtmlxEvent(window, "load", function () {
      dhtmlx.message({ type: "alert", text: "Hello world" });
    });
  </script>
</body>

</html>
```

Update `index.js`:
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  // step2: instead of sending a string, we send a file
  res.sendFile(__dirname + '/index.html');
});

app.listen(3000, () => {
  console.log('listening on *:3000');
});
```
Restart your node application and enjoy the majesty.

![Screenshot of dhtmlx with only a modal dialogue saying hello world](/tutorial_images/Screenshot_20180523_102030.png)

# Step 3: Initialize the layout, grid and form with static data

Best practices is to not mix html, javascript, css, etc together, so in this case, we are writing our dhtmlx app inline of index.html. Let's fix that. Before we do that, we need to create folder that is able to load our static files. We call this folder `public`.

- `mkdir public`
- `mv index.html public`

Update `index.js`

```javascript
const express = require('express');
const app = express();
const path = require('path'); // step 3: we need to add path in order to use it

app.use('/', express.static(path.join(__dirname, 'public'))); // step 3: just serve up the full public directory

app.listen(3000, () => {
  console.log('listening on *:3000');
});
```
- type `node .` just to make sure we didn't break anything.

![Screenshot of dhtmlx with only a modal dialogue saying hello world](/tutorial_images/Screenshot_20180523_102030.png)

Now it is time to extract the javascript from `index.html`.

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" type="text/css" href="//cdn.dhtmlx.com/edge/dhtmlx.css">
  <script src="//cdn.dhtmlx.com/edge/dhtmlx.js"></script>
</head>

<body>
  <script type="text/javascript" src="app.js"></script>
</body>

</html>
```

Create a new file `public/app.js`

```javascript
dhtmlxEvent(window, "load", function () {
  dhtmlx.message({ type: "alert", text: "Hello world" });
});
```

Save and restart the server

![Screenshot of dhtmlx with only a modal dialogue saying hello world, network tab expanded showing app.js loading](/tutorial_images/Screenshot_20180523_104326.png)

Isn't that sweet.

Before we continue we probably are tired of restarting the server. Let's fix that using nodemon.

`npm i --save-dev nodemon`

We don't need to install globally as we can access the nodemon executables from the npm script.

Update `package.json`, add a `start`-script and add an ignore for the public folder:

```json
{
  "//<!--...":"...-->",

  "scripts": {
    "start": "nodemon ./index.js --ignore public/",
    "test": "echo \"Error: no test specified\" && exit 1"
  },

  "//<!--...":"...-->",

  "dependencies": {
    "express": "^4.16.3"
  },
  "devDependencies": {
    "nodemon": "^1.17.5"
  }
}
```
Now we are going to create the sidebar and the menu. It seems the demo app ['CRM System'](https://dhtmlx.com/docs/products/demoApps/dhtmlxCRMSystem/index.html) uses a different skin.

Update `index.html`:

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <link rel="stylesheet" type="text/css" href="//cdn.dhtmlx.com/edge/skins/web/dhtmlx.css">
  <script src="//cdn.dhtmlx.com/edge/dhtmlx.js"></script>
  <link rel="stylesheet" type="text/css" href="style.css">
</head>

<body>
  <script type="text/javascript" src="app.js"></script>
</body>

</html>
```

Also create `public/style.css`
```css
html, body {
	width: 100%;
	height: 100%;
	margin: 0px;
	overflow: hidden;
}
```

Then we need to create all elements, update `public/app.js`

```javascript
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
    // todo, below doesn't look right; HTML in javascript
    mainToolbar.setItemText("title", window.dhx4.template("<span style='font-weight: bold; font-size: 14px;'>#text#</span>", { text: mainSidebar.cells(id).getText().text }));
  });

  // select 'Contacts' by default
  mainSidebar.cells("contacts").setActive(true);
}

dhtmlxEvent(window, "load", appInit);

```

Refresh and this is what we get:

![Screenshot of dhtmlx a sidebar with 4 items and a toolbar with two buttons](/tutorial_images/Screenshot_20180523_135554.png)

Now the demo uses different js files for the 4 options in the menu and this is initialized on start. We combine the file to improve performance to have only one js file downloaded. Also the demo uses Google maps, we just ignore this feature for now as we need API keys in order for it to work. Also we need tons of images, data files etc. We combine this into one app. Next to that we need to remove the loader from the codebase.

All this is done in this branch: [step3](https://github.com/rkristelijn/dhtmlx-json-node/tree/step3)

The application looks now like this, and no console errors.

![Screenshot of dhtmlx with a working grid that changes also the form when you click a record](/tutorial_images/Screenshot_20180528_112120.png)

![Screenshot of dhtmlx with the projects tile opened showing a grid, a graph and detail view](/tutorial_images/Screenshot_20180528_112132.png)

![Screenshot of dhtmlx with the event tile opened, showing tiles of events](/tutorial_images/Screenshot_20180528_112143.png)

![Screenshot of dhtmlx with the settings tile opened showing tiles and a form](/tutorial_images/Screenshot_20180528_112153.png)

# Step 3 a: Change XML to JSON

JSON is much more lightweight than XML. 

```bash
pi@raspberry:~/dhtmlx-json-node/public/server $ ls -al
4364 contacts-minified.json
4445 contacts-ndjson.json
5639 contacts-minified.xml
6475 contacts-fully-beautified.json
6588 contacts-fully-beautified.xml
```

I'm only drawing conclusions on the minified versions, this is an improvement of (5639-4364) is 1275 bytes less (23% smaller). Let alone having to encode binary data using base64. It is the same for JSON, however there is [BSON](http://bsonspec.org)

Steps to convert dhx XML to JSON:

1. use [XML to JSON](http://www.utilities-online.info/xmltojson/) to convert data
2. replace `"-width"` with `"width"`, same for `id`, `type`, `align`, `sort` -> by replacing `"-` for `"-`
3. replace `"#text"` with `"value"`
4. repoace `"cell"` with `"data"`
4. replace `"#cdata-section"` with `"value"`
5. remove `rows` level on top, remove `colums` level in head, rename `row` to `rows` below the header

Now we need to update the function calls to 'eat' JSON instead of XML. The weird thing is that every dhx object seems to need a different structure.

## Old Code:

```javascript
// ... CONTACTS
contactsGrid.load(A.server + "contacts.xml?type=" + A.deviceType, function () {
  contactsGrid.selectRow(0, true);
});
// ... PROJECTS
projectsGrid.load(A.server + "projects.xml?type=" + A.deviceType, function () {
  projectsGrid.selectRow(0, true);
});
// ... EVENTS
eventsDataView.load(A.server + "events.xml?type=" + A.deviceType);

// ... SETTINGS
settingsDataView.load(A.server + "settings.xml?type=" + A.deviceType, function () {
  settingsDataView.select("contacts");
});
```

## New Code:
```javascript
// ... CONTACTS
contactsGrid.load(A.server + "contacts.json?type=" + A.deviceType, function () {
  contactsGrid.selectRow(0, true);
}, "json");

// ... PROJECTS
projectsGrid.load(A.server + "projects.json?type=" + A.deviceType, function () {
  projectsGrid.selectRow(0, true);
}, "json");

// ... EVENS
eventsDataView.load(A.server + "events.json?type=" + A.deviceType, "json");

// ... SETTINGS
// load the data, somehow a callback doesn't work
settingsDataView.load(A.server + "settings.json", "json");
// fires when the data loading is finished and a component or data is rendered
settingsDataView.attachEvent("onXLE", function () {
  settingsDataView.select("contacts");
});
```

# Step 4: Create and connect REST API

# References

## DHTMLX

Most important, the [dhtmlx](https://docs.dhtmlx.com/index.html) API refences:


### Layout 

|[Accordion](https://docs.dhtmlx.com/api__refs__dhtmlxaccordion.html)| [Carousel](https://docs.dhtmlx.com/api__refs__dhtmlxcarousel.html) | [Layout](https://docs.dhtmlx.com/api__refs__dhtmlxlayout.html) | [Popup](https://docs.dhtmlx.com/api__refs__dhtmlxpopup.html) | [Tabbar](https://docs.dhtmlx.com/api__refs__dhtmlxtabbar.html) | [Windows](https://docs.dhtmlx.com/api__refs__dhtmlxwindows.html) |
|:-:|:-:|:-:|:-:|:-:|:-:|
|[![icon](/tutorial_images/dhx_icons/icon_accordion.png)](https://docs.dhtmlx.com/api__refs__dhtmlxaccordion.html)|[![icon](/tutorial_images/dhx_icons/icon_carousel.png)](https://docs.dhtmlx.com/api__refs__dhtmlxcarousel.html)|[![icon](/tutorial_images/dhx_icons/icon_layout.png)](https://docs.dhtmlx.com/api__refs__dhtmlxlayout.html) |[![icon](/tutorial_images/dhx_icons/icon_popup.png)](https://docs.dhtmlx.com/api__refs__dhtmlxpopup.html)|[![icon](/tutorial_images/dhx_icons/icon_tabbar.png)](https://docs.dhtmlx.com/api__refs__dhtmlxtabbar.html) |[![icon](/tutorial_images/dhx_icons/icon_windows.png)](https://docs.dhtmlx.com/api__refs__dhtmlxwindows.html) 

### Data Components 

|[Chart](https://docs.dhtmlx.com/api__refs__dhtmlchart.html)| [DataView](https://docs.dhtmlx.com/api__refs__dhtmlxdataview.html) | [Grid](https://docs.dhtmlx.com/api__refs__dhtmlxgrid.html) | [List](https://docs.dhtmlx.com/api__refs__dhtmlxlist.html) | [TreeGrid](https://docs.dhtmlx.com/api__refs__dhtmlxtreegrid.html) | [TreeView](https://docs.dhtmlx.com/api__refs__dhtmlxtreeview.html) |
|:-:|:-:|:-:|:-:|:-:|:-:|
|[![icon](/tutorial_images/dhx_icons/icon_chart.png)](https://docs.dhtmlx.com/api__refs__dhtmlxchart.html)|[![icon](/tutorial_images/dhx_icons/icon_dataview.png)](https://docs.dhtmlx.com/api__refs__dhtmlxdataview.html)|[![icon](/tutorial_images/dhx_icons/icon_grid.png)](https://docs.dhtmlx.com/api__refs__dhtmlxgrid.html) |[![icon](/tutorial_images/dhx_icons/icon_list.png)](https://docs.dhtmlx.com/api__refs__dhtmlxlist.html)|[![icon](/tutorial_images/dhx_icons/icon_treegrid.png)](https://docs.dhtmlx.com/api__refs__dhtmlxtreegrid.html) |[![icon](/tutorial_images/dhx_icons/icon_treeview.png)](https://docs.dhtmlx.com/api__refs__dhtmlxtreeview.html) 

### Form-oriented Components 

| [Calendar](https://docs.dhtmlx.com/api__refs__dhtmlxcalendar.html)| [ColorPicker](https://docs.dhtmlx.com/api__refs__dhtmlxcolorpicker.html) | [Combo](https://docs.dhtmlx.com/api__refs__dhtmlxcombo.html) | [Editor](https://docs.dhtmlx.com/api__refs__dhtmlxeditor.html) | [Form](https://docs.dhtmlx.com/api__refs__dhtmlxform.html) | [Slider](https://docs.dhtmlx.com/api__refs__dhtmlxslider.html) 
|:-:|:-:|:-:|:-:|:-:|:-:|
|[![icon](/tutorial_images/dhx_icons/icon_calendar.png)](https://docs.dhtmlx.com/api__refs__dhtmlxcalendar.html)|[![icon](/tutorial_images/dhx_icons/icon_colorpicker.png)](https://docs.dhtmlx.com/api__refs__dhtmlxcolorpicker.html)|[![icon](/tutorial_images/dhx_icons/icon_combo.png)](https://docs.dhtmlx.com/api__refs__dhtmlxcombo.html) |[![icon](/tutorial_images/dhx_icons/icon_editor.png)](https://docs.dhtmlx.com/api__refs__dhtmlxeditor.html)|[![icon](/tutorial_images/dhx_icons/icon_form.png)](https://docs.dhtmlx.com/api__refs__dhtmlxform.html) |[![icon](/tutorial_images/dhx_icons/icon_slider.png)](https://docs.dhtmlx.com/api__refs__dhtmlxslider.html) |

### Navigation Components

| [Menu](https://docs.dhtmlx.com/api__refs__dhtmlxmenu.html)| [Ribbon](https://docs.dhtmlx.com/api__refs__dhtmlxribbon.html) | [Sidebar](https://docs.dhtmlx.com/api__refs__dhtmlxsidebar.html) | [Toolbar](https://docs.dhtmlx.com/api__refs__dhtmlxtoolbar.html) |
|:-:|:-:|:-:|:-:|
|[![icon](/tutorial_images/dhx_icons/icon_menu.png)](https://docs.dhtmlx.com/api__refs__dhtmlxmenu.html)|[![icon](/tutorial_images/dhx_icons/icon_ribbon.png)](https://docs.dhtmlx.com/api__refs__dhtmlxribbon.html)|[![icon](/tutorial_images/dhx_icons/icon_sidebar.png)](https://docs.dhtmlx.com/api__refs__dhtmlxsidebar.html) |[![icon](/tutorial_images/dhx_icons/icon_toolbar.png)](https://docs.dhtmlx.com/api__refs__dhtmlxtoolbar.html)

## Markdown

- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)


## Create a branch

`git checkout -b step1`
