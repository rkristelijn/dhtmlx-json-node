let contactsController = (Model) => {
  // hardcoded header
  let _head = [
    { "id": "photo", "width": "65", "type": "ro", "align": "center", "sort": "na", "value": "<span style='padding-left:60px;'>Name</span>" },
    { "id": "name", "width": "150", "type": "ed", "align": "left", "sort": "na", "value": "#cspan" },
    { "id": "dob", "width": "130", "type": "ed", "align": "left", "sort": "na", "value": "Date of Birth" },
    { "id": "pos", "width": "130", "type": "ed", "align": "left", "sort": "na", "value": "Position" },
    { "id": "email", "width": "170", "type": "ed", "align": "left", "sort": "na", "value": "E-mail Address" },
    { "id": "phone", "width": "150", "type": "ed", "align": "left", "sort": "na", "value": "Phone" },
    { "id": "company", "width": "150", "type": "ed", "align": "left", "sort": "na", "value": "Company" },
    { "id": "info", "width": "*", "type": "ed", "align": "left", "sort": "na", "value": "Additional" }
  ];

  // just find all data in table
  let _readAll = (callback) => {
    Model.find({}, (err, contacts) => {
      if (err) callback(err, null);
      else callback(null, { head: _head, rows: _toRows(contacts) });
    });
  };

  // find one and update with one atomic operation, forcing the altered document to return
  let _updateOne = (id, data, callback) => {
    Model.findOneAndUpdate({ _id: id }, data, { new: true }, (err, contact) => {
      if (err) callback(err, null);
      else callback(null, contact);
    });
  };

  // create {id:x,data:[y,z,...]} from {_id:x,y:'',z:''}
  let _toRows = (rows) => {
    let result = [];
    for (row of rows) {
      result.push({
        id: row._id, data: [row.photo, row.name, row.dob, row.pos, row.email, row.phone, row.company, row.info]
      });
    }
    return result;
  };

  // revealing model pattern, not revealing _toRows()
  return {
    readAll: _readAll,
    updateOne: _updateOne
  };
}

module.exports = contactsController;
