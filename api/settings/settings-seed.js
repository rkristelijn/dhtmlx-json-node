const Setting = require('./settings-model');
const fs = require('fs');

fs.readFile('./api/settings/settings.json', (err, data) => {
  console.log(`Creating settings...`);

  if (err) console.log('error', err);
  obj = JSON.parse(data);
  for (item of obj) {
    console.log(`\tCreating ${item.id}...`);
    setting = new Setting({
      name: item.id,
      image: item.image,
      title: item.title,
      descr: item.descr
    });

    setting.save((err) => {
      if (err) {
        console.log('error', err);
      }
    });
  }
});
