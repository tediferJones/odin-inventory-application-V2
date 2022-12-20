const Accessory = require('../models/accessory');

const { body, validationResult } = require('express-validator');

exports.accessory_list = (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Accessory List');
  Accessory.find({})
    .sort({name : 1})
    .exec(function (err, accessories_list) {
      if (err) { return next(err); }
      res.render('accessory_list', {title: 'Accessory List', accessories_list});
    })
};

exports.accessory_detail = (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Accessory Detail');
  Accessory.findById(req.params.id)
    .exec(function (err, accessory_detail) {
      if (err) { return next(err); }

      if (accessory_detail == null) {
        const err = new Error('Accessory Not Found');
        err.status = 404;
        return next(err);
      }

      res.render('accessory_detail', { title: 'Accessory Detail', accessory_detail})
    })
};

exports.accessory_create_get = (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Accessory Create Get');
  res.render('accessory_form', { title: 'Create Accessory' });
};

exports.accessory_create_post = [ // (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Accessory Create Post');
  body('name').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const accessory = new Accessory({
      name: req.body.name
    })

    if (!errors.isEmpty()) {
      res.render('accessory_form', { title: 'Create Accessory', accessory, errors: errors.array() });
      return;
    } else {
      Accessory.findOne({ name: req.body.name })
        .exec((err, found_accessory) => {
          if (err) { return next(err); }

          if (found_accessory) {
            res.redirect(found_accessory.url);
          } else {
            accessory.save((err) => {
              if (err) { return next(err); }
              res.redirect(accessory.url)
            })
          }
        })
    }
  }
];

exports.acccessry_delete_get = (req, res, next) => {
  Accessory.findById(req.params.id)
    .exec(function (err, accessory) {
      if (err) { return next(err); }

      if (accessory == null) {
        res.redirect('/catalog/accessories')
      }

      res.render('accessory_delete', { title: 'Delete Accessory', accessory })
    })
};

exports.accessory_delete_post = (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Accessory Delete Post');
  Accessory.findByIdAndRemove(req.body.accessoryid, function deleteAccessory(err) {
    if (err) { return next(err); }
    res.redirect('/catalog/accessories');
  })
};

exports.accessory_update_get = (req, res, next) => {
  // res.send('NOT IMPLEMENTED: Accessory Update Get');
  Accessory.findById(req.params.id)
    .exec(function (err, accessory) {
      if (err) { return next(err); }
      res.render('accessory_form', { title: 'Update Accessory', accessory })
    })
};

exports.accessory_update_post = [ //(req, res, next) => {
  // res.send('NOT IMPLEMENTED: Accessory Update Post');
  body('name').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const accessory = new Accessory({
      name: req.body.name,
      _id: req.params.id
    });

    if (!errors.isEmpty()) {
      res.render('accessory_form', { title: 'Update Accessory', accessory, errors: errors.array() });
    }

    Accessory.findByIdAndUpdate(req.params.id, accessory, {}, function(err, theaccessory) {
      if (err) { return next(err); }
      res.redirect(accessory.url)
    })
  }
];