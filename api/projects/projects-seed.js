const Project = require('./projects-model');
const fs = require('fs');

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

    project.save(err => {
      if (err) {
        console.log('error', err);
      }
    });
  }
});
