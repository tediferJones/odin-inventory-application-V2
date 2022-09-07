const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MakeSchema = new Schema({
  name: {type: String, required: true, maxLength: 32}
})

MakeSchema
  .virtual('url')
  .get(function() {
    return `/catalog/make/${this._id}`;
  });

modules.exports = mongoose.model('Make', MakeSchema);