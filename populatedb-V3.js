#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Make = require('./models/make')
var Model = require('./models/model')
var Accessory = require('./models/accessory')
var Vehicle = require('./models/vehicle')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var makes = []
var models = []
var accessories = []
var vehicles = []

function makeCreate(make_name, cb) {
  var make = new Make({
    name: make_name
  });

  make.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Make:' + make);
    makes.push(make)
    cb(null, make)
  });
}

function modelCreate(name, trim, year, cb) {
  var model = new Model({
    name: name,
    trim: trim,
    year: year,
  });

  model.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Model:' + model)
    models.push(model)
    cb(null, model)
  });
}

function accessoryCreate(name, cb) {
  var accessory = new Accessory({
    name: name
  });

  accessory.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Accessory: ' + accessory)
    accessories.push(accessory);
    cb(null, accessory)
  })
}

function vehicleCreate(make, model, accessory_arr, color, cb) {
  var vehicle = new Vehicle({
    make: make,
    model: model,
    accessories: accessory_arr, // PROBABLY NEEDS CHANGED
    color: color
  })

  vehicle.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Vehicle' + vehicle)
    vehicles.push(vehicle);
    cb(null, vehicle)
  })
}

// CREATE ORDER: Make -> model -> accessories -> vehicle

function createMake(cb) {
  async.series([
    function(callback) {
      makeCreate('Toyota', callback)
    },
    function(callback) {
      makeCreate('Honda', callback)
    },
    function(callback) {
      makeCreate('Volkswagen', callback)
    },
    function(callback) {
      makeCreate('Dodge', callback)
    },
    function(callback) {
      makeCreate('Chevrolet', callback)
    },
  ],
  cb);
}

function createModel(cb) {
  async.series([
    function(callback) {
      modelCreate('Corolla', 'LE', 2004, callback)
    },
    function(callback) {
      modelCreate('Corolla', 'CE', 2006, callback)
    },
    function(callback) {
      modelCreate('Camry', 'LE', 2003, callback)
    },
    function(callback) {
      modelCreate('CR-V', undefined, 2004, callback)
    },
    function(callback) {
      modelCreate('Neon', 'SXT', 2004, callback)
    },
    function(callback) {
      modelCreate('Jetta', 'TDI', 2002, callback)
    },
    function(callback) {
      modelCreate('Jetta', 'GLI', 2016, callback)
    },
    function(callback) {
      modelCreate('Golf', 'GTI', 2012, callback)
    },
    function(callback) {
      modelCreate('Cobalt', 'SLE', 2012, callback)
    }
  ], cb)
}

function createAccessories(cb) {
  async.series([
    function (callback) {
      accessoryCreate('Heated Seats', callback)
    },
    function (callback) {
      accessoryCreate('Air Conditioning', callback)
    },
    function (callback) {
      accessoryCreate('Sun Roof', callback)
    },
    function (callback) {
      accessoryCreate('Power Windows', callback)
    },
    function (callback) {
      accessoryCreate('Remote Start', callback)
    },
  ], cb)
}

function createVehicle(cb) {
  async.series([
    function(callback) {
      vehicleCreate(makes[0], models[0], [accessories[1], accessories[3]], 'Black', callback)
    },
    function(callback) {
      vehicleCreate(makes[1], models[3], [accessories[2]], 'Beige', callback)
    },
    function(callback) {
      vehicleCreate(makes[2], models[5], [accessories[1], accessories[2], accessories[3]], 'Grey', callback)
    },
    function(callback) {
      vehicleCreate(makes[3], models[4], [accessories[1], accessories[2]], 'White', callback)
    },
    function(callback) {
      vehicleCreate(makes[4], models[8], [accessories[1]], 'white', callback)
    },
  ], cb)
}


async.series([
    createMake,
    createModel,
    createAccessories,
    createVehicle
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('NO ERRORS (ALLEGEDLY)');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

// NEEDS TO BE RE-WRITTEN FOR THE CURRENT PROJECT
// ORIGINAL SCRIPT: https://raw.githubusercontent.com/hamishwillee/express-locallibrary-tutorial/master/populatedb.js