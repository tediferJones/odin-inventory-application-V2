const Make = require('../models/make');

const { body, validationResult } = require('express-validator');

exports.make_list = (req, res, next) => {
  Make.find({})
    .sort({ name : 1 })
    .exec(function(err, makes_list) {
      if (err) { return next(err); }
      res.render('make_list', { title: 'Make List', makes_list})
    })
};

exports.make_detail = (req, res, next) => {
  Make.findById(req.params.id)
    .exec(function(err, make_detail) {
      if (err) { return next(err); }

      if (make_detail == null) {
        const err = new Error('Make Not Found');
        err.status = 404;
        return next(err);
      }

      res.render('make_detail', { title: 'Make Detail', make_detail })
    })
};

exports.make_create_get = (req, res, next) => {
  res.render('make_form', { title: 'Create Make' });
};

exports.make_create_post = [
  body('name').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const make = new Make({
      name: req.body.name
    });

    if (!errors.isEmpty()) {
      res.render('make_form', { title: 'Create Make', make, errors: errors.array() });
      return;
    } else {
      Make.findOne({ name: req.body.name })
        .exec((err, found_make) => {
          if (err) { return next(err); }

          if (found_make) {
            res.redirect(found_make.url)
          } else {
            make.save((err) => {
              if (err) { return next(err); }
              res.redirect(make.url)
            })
          }
        })
    }
  }
];

exports.make_delete_get = (req, res, next) => {
  Make.findById(req.params.id)
    .exec(function (err, make) {
      if (err) { return next(err); }

      if (make == null) {
        res.redirect('/catalog/makes')
      }

      res.render('make_delete', { title: 'Delete Make', make });
    })
};

exports.make_delete_post = (req, res, next) => {
  Make.findByIdAndRemove(req.body.makeid, function deleteMake(err) {
    if (err) { return next(err); }
    res.redirect('/catalog/makes');
  })
};

exports.make_update_get = (req, res , next) => {
  Make.findById(req.params.id)
    .exec(function (err, make) {
      if (err) { return next(err); }
      res.render('make_form', { title: 'Update Make', make })
    })
};

exports.make_update_post = [
  body('name').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const make = new Make({
      name: req.body.name,
      _id: req.params.id
    })

    if (!errors.isEmpty()) {
      res.render('make_form', { title: 'Update Make', make, errors: errors.array() });
    }

    Make.findByIdAndUpdate(req.params.id, make, {}, function(err, themake) {
      if (err) { return next(err); }
      res.redirect(make.url);
    })
  }
];