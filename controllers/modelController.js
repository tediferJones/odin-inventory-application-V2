const Make = require('../models/make');
const Model = require('../models/model');
const Accessory = require('../models/accessory');
const Vehicle = require('../models/vehicle');

const async = require('async');
const { body, validationResult } = require('express-validator')

// SECRET SAUCE
exports.index = (req, res, next) => {
  async.parallel({
    make_count(callback) {
      Make.countDocuments({}, callback);
    },
    model_count(callback) {
      Model.countDocuments({}, callback);
    },
    accessory_count(callback) {
      Accessory.countDocuments({}, callback);
    },
    vehicle_count(callback) {
      Vehicle.countDocuments({}, callback)
    }
  }, (err, results) => {
    res.render('index', {title: 'Car Sales Home Page', error: err, data: results });
  })
};

exports.model_list = (req, res, next) => {
  Model.find({})
    .sort({year : 1})
    .exec(function (err, models_list) {
      if (err) { return next(err); }
      res.render('model_list', { title: 'Model List', models_list})
    })
};

exports.model_detail = (req, res, next) => {
  Model.findById(req.params.id)
  .exec(function(err, model_detail) {
    if (err) { return next(err); }

    if (model_detail == null) {
      const err = new Error('Model Not Found');
      err.status = 404;
      return next(err);
    }

    res.render('model_detail', { title: 'Model Detail', model_detail });
  })
};

exports.model_create_get = (req, res, next) => {
  res.render('model_form', { title: 'Create Model' });
};

exports.model_create_post = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('trim').trim().isLength({ min: 1 }).escape(),
  body('year').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const model = new Model({
      name: req.body.name,
      trim: req.body.trim,
      year: req.body.year,
    })

    if (!errors.isEmpty()) {
      res.render('model_form', { title: 'Create Model', model, errors: errors.array() });
      return;
    } else {
      // check if the "new" model already exists, if it does, re-direct to that page, otherwise, save it and redirect to new model url
      Model.findOne({ name: req.body.name, trim: req.body.trim, year: req.body.year })
        .exec((err, found_model) => {
          if (err) { return next(err); }

          console.log(found_model)

          if (found_model) {
            res.redirect(found_model.url)
          } else {
            model.save((err) => {
              if (err) { return next(err); }
              res.redirect(model.url)
            })
          }
        })
    }
  }
];

exports.model_delete_get = (req, res, next) => {
  Model.findById(req.params.id)
    .exec(function (err, model) {
      if (err) { return next(err); }

      if (model == null) {
        res.redirect('/catalog/models')
      }

      res.render('model_delete', { title: 'Delete Model', model })
    })
};

exports.model_delete_post = (req, res, next) => {
  Model.findByIdAndRemove(req.body.modelid, function deleteModel(err) {
    if (err) { return next(err); }
    res.redirect('/catalog/models');
  })
};

exports.model_update_get = (req, res, next) => {
  Model.findById(req.params.id)
    .exec(function (err, model) {
      if (err) { return next(err); }
      res.render('model_form', { title: 'Update Model', model })
    })
};

exports.model_update_post = [
  body('name').trim().isLength({ min: 1 }).escape(),
  body('trim').trim().isLength({ min: 1 }).escape(),
  body('year').trim().isLength({ min: 4 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const model = new Model({
      name: req.body.name,
      trim: req.body.trim,
      year: req.body.year,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render('model_form', { title: 'Update Model', model, errors: errors.array() })
    }

    Model.findByIdAndUpdate(req.params.id, model, {}, function(err, themodel) {
      if (err) { return next(err); }
      res.redirect(model.url);
    })
  }
];