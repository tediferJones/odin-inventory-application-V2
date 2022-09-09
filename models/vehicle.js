const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
  make: { type: Schema.Types.ObjectId, required: true },
  model: { type: Schema.Types.ObjectId, required: true },
  accessories: [{ type: Schema.Types.ObjectId, required: true , ref: 'Accessory'}],
  color: { type: String, required: true}
})

VehicleSchema
  .virtual('url')
  .get(function() {
    return '/catalog/vehicle' + this._id;
  });

module.exports = mongoose.model('Vehicle', VehicleSchema);