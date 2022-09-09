const express = require('express');
const router = express.Router();

const make_controller = require('../controllers/makeController');
const model_controller = require('../controllers/modelController');
const accessory_controller = require('../controllers/accessoryController');
const vehicle_controller = require('../controllers/vehicleController');

// Special Sauce
router.get('/', model_controller.index);

router.get('/make/create', make_controller.make_create_get);
router.post('/make/create', make_controller.make_create_post);
router.get('/make/:id/delete', make_controller.make_delete_get);
router.post('/make/:id/delete', make_controller.make_delete_post);
router.get('/make/:id/update', make_controller.make_update_get);
router.post('/make/:id/update', make_controller.make_update_post);
router.get('/make/:id', make_controller.make_detail);
router.get('/makes', make_controller.make_list);

router.get('/model/create', model_controller.model_create_get);
router.post('/model/create', model_controller.model_create_post);
router.get('/model/:id/delete', model_controller.model_delete_get);
router.post('/model/:id/delete', model_controller.model_delete_post);
router.get('/model/:id/update', model_controller.model_update_get);
router.post('/model/:id/update', model_controller.model_update_post);
router.get('/model/:id', model_controller.model_detail);
router.get('/models', model_controller.model_list);

router.get('/accessory/create', accessory_controller.accessory_create_get);
router.post('/accessory/create', accessory_controller.accessory_create_post);
router.get('/accessory/:id/delete', accessory_controller.acccessry_delete_get);
router.post('/accessory/:id/delete', accessory_controller.accessory_delete_post);
router.get('/accessory/:id/update', accessory_controller.accessory_update_get);
router.post('/accessory/:id/update', accessory_controller.accessory_update_post);
router.get('/accessory/:id', accessory_controller.accessory_detail);
router.get('/accessories', accessory_controller.accessory_list);

router.get('/vehicle/create', vehicle_controller.vehicle_create_get);
router.post('/vehicle/create', vehicle_controller.vehicle_create_post);
router.get('/vehicle/:id/delete', vehicle_controller.vehicle_delete_get);
router.post('/vehicle/:id/delete', vehicle_controller.vehicle_delete_post);
router.get('/vehicle/:id/update', vehicle_controller.vehicle_update_get);
router.post('/vehicle/:id/update', vehicle_controller.vehicle_update_post);
router.get('/vehicle/:id', vehicle_controller.vehicle_detail);
router.get('/vehicles', vehicle_controller.vehicle_list);

module.exports = router;
