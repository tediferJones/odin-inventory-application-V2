const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccessorySchema = new Schema({
  // not sure what to do here
  // dont make a list of individual options all true or false
  // currate a list of only "TRUE" accessories
})

AccessorySchema
  .virtual('url')
  .get(function() {
    return 'catalog/accessory/' + this._id;
  });

module.exports = mongoose.model('Accessory', AccessorySchema);