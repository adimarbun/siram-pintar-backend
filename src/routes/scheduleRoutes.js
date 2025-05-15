const express = require('express');
const ScheduleController = require('../controllers/scheduleController');
const router = express.Router();

// Route to create a schedule
router.post('', ScheduleController.create);

// Route to get all schedules
router.get('', ScheduleController.getAll);

// Route to get a schedule by ID
router.get('/:id', ScheduleController.getById);

// Route to get a schedule by device ID
router.get('/device/:id', ScheduleController.getSchedulesByDeviceId);

// Route to update a schedule by ID
router.put('/:id', ScheduleController.update);

// Route to delete a schedule by ID
router.delete('/:id', ScheduleController.delete);

module.exports = router;
