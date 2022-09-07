const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ModelSchema = new Schema({
  name: { type: String, required: true, maxLength: 32 },
  trim: { type: String },
  year: { type: Number, required: true, maxLength: 4 },
})

ModelSchema
  .virtual('url')
  .get(function() {
    return `/catalog/model/${this._id}`;
  });

module.exports = mongoose.model('Model', ModelSchema);