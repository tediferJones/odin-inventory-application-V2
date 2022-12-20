const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AccessorySchema = new Schema({
  name: { type: String, maxLength: 32 }
})

AccessorySchema
  .virtual('url')
  .get(function() {
    // return 'catalog/accessory/' + this._id; THIS LINE IS GARBAGE, NO IDEA WHY
    return `/catalog/accessory/${this._id}`;
  });

module.exports = mongoose.model('Accessory', AccessorySchema);