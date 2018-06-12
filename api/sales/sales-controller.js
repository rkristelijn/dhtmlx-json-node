let salesController = (Model) => {
  let _createOne = (data, callback) => {
    Model.create(data, (err, object) => {
      if (err) callback(err, null);
      else callback(null, object);
    });
  };

  let _findByParent = (parentName, parentType, callback) => {
    Model.find({ parentName: parentName, parentType: parentType }).sort({order:1}).exec((err, items) => {
      if (err) callback(err, null);
      else callback(null, _toRows(items));
    });
  };

  let _toRows = (rows) => {
    let result = [];
    for (row of rows) {
      result.push({
        sales: row.sales, month: row.month, order: row.order
      });
    }
    return result;
  };

  return {
    createOne: _createOne,
    findByParent: _findByParent
  };
}

module.exports = salesController;
