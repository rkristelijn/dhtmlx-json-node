let projectsController = (Model) => {
  let _head = [
    { "id": "due", "width": "120", "type": "ed", "align": "left", "sort": "na", "value": "Due date" },
    { "id": "project", "width": "210", "type": "ed", "align": "left", "sort": "na", "value": "Project" },
    { "id": "status", "width": "120", "type": "ed", "align": "left", "sort": "na", "value": "Status" },
    { "id": "assign", "width": "230", "type": "ed", "align": "left", "sort": "na", "value": "Assigned to" },
    { "id": "info", "width": "*", "type": "ed", "align": "left", "sort": "na", "value": "Additional" }
  ];

  let _readAll = (callback) => {
    Model.find({}, (err, objects) => {
      if (err) callback(err, null);
      else callback(null, { head: _head, rows: _toRows(objects) });
    });
  };

  let _updateOne = (id, data, callback) => {
    Model.findOneAndUpdate({ _id: id }, data, { new: true }, (err, object) => {
      if (err) callback(err, null);
      else callback(null, object);
    });
  };

  let _createOne = (data, callback) => {
    Model.create(data, (err, object) => {
      if (err) callback(err, null);
      else callback(null, object);
    });
  };

  let _deleteOne = (id, callback) => {
    Model.findByIdAndRemove({ _id: id }, (err) => {
      if (err) callback(err, null);
      else callback(null, null);
    });
  };

  let _toRows = (rows) => {
    let result = [];
    for (row of rows) {
      result.push({
        id: row._id, data: [row.due, row.project, row.status, row.assign, row.info]
      });
    }
    return result;
  };

  return {
    readAll: _readAll,
    updateOne: _updateOne,
    createOne: _createOne,
    deleteOne: _deleteOne
  };
}

module.exports = projectsController;
