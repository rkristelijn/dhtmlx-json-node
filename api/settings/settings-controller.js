let settingsController = (Model) => {
  let _readAll = (callback) => {
    Model.find({}, (err, settings) => {
      if (err) callback(err, null);
      else callback(null, _toRows(settings));
    });
  };

  // find one and update with one atomic operation, forcing the altered document to return
  let _updateOne = (id, data, callback) => {
    Model.findOneAndUpdate({ _id: id }, data, { new: true }, (err, contact) => {
      if (err) callback(err, null);
      else callback(null, contact);
    });
  };

  let _createOne = (data, callback) => {
    Model.create(data, (err, contact) => {
      if (err) callback(err, null);
      else callback(null, contact);
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
        id: row._id,
        name: row.name,
        title: row.title,
        image: row.image,
        descr: row.descr
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

module.exports = settingsController;
