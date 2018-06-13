const Event = require('./events-model');
const fs = require('fs');

fs.readFile('./api/events/events.json', (err, data) => {
  console.log(`Creating events...`);

  if (err) console.log('error', err);
  obj = JSON.parse(data);
  for (item of obj.data) {
    console.log(`\tCreating ${item.title}...`);
    event = new Event({
      image: item.image,
      title: item.title,
      date: item.date,
      place: item.place,
      lat: item.lat,
      lng: item.lng
    });

    event.save((err) => {
      if (err) {
        console.log('error', err);
      }
    });
  }
});
