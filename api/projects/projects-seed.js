const Project = require('./projects-model');
const Sales = require('../sales/sales-model');
const fs = require('fs');

function monthToNr(month) {
  switch (month) {
    case "Jan": return 1;
    case "Feb": return 2;
    case "Mar": return 3;
    case "Apr": return 4;
    case "May": return 5;
    case "Jun": return 6;
    case "Jul": return 7;
    case "Aug": return 8;
    case "Sep": return 9;
    case "Oct": return 10;
    case "Nov": return 11;
    case "Dec": return 12;
  }
}

fs.readFile('./api/projects/projects.json', (err, data) => {
  console.log(`Creating projects...`);

  if (err) console.log('error', err);
  obj = JSON.parse(data);
  for (item of obj.rows) {
    console.log(`\tCreating ${item.data[1]}...`);
    project = new Project({
      due: item.data[0],
      project: item.data[1],
      status: item.data[2],
      assign: item.data[3]
    });

    let parentName = item.data[1];

    project.save((err, project) => {
      if (err) {
        console.log('error', err);
      }
    });

    console.log(`\t\tCreating sales...`);
    let fileName = item.data[1].replace(/ /g, "\ ");
    fs.readFile(`./api/sales/${fileName}.json`, (err, data) => {
      if (err) console.log('error', err);
      obj = JSON.parse(data);
      for (item of obj) {
        sales = new Sales({
          parentName: parentName,
          parentType: 'project',
          sales: item.sales,
          month: item.month,
          color: item.color,
          order: monthToNr(item.month)
        });

        sales.save(err => {
          if (err) {
            console.log('error', err);
          }
        });
      }
    });
  }
});
