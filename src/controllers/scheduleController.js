const ScheduleService = require('../services/scheduleService');

class ScheduleController {
  // Create a new schedule
  static async create(req, res) {
    try {
      const scheduleData = req.body;
      const newSchedule = await ScheduleService.create(scheduleData);
      res.status(201).json({
        message: 'Schedule created successfully',
        data: newSchedule,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Get all schedules
  static async getAll(req, res) {
    try {
      const schedules = await ScheduleService.getAll();
      res.status(200).json({
        message: 'Schedules retrieved successfully',
        data: schedules,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Get schedule by ID
  static async getById(req, res) {
    const { id } = req.params;
    try {
      const schedule = await ScheduleService.getById(id);
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.status(200).json({
        message: 'Schedule retrieved successfully',
        data: schedule,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Update schedule
  static async update(req, res) {
    const { id } = req.params;
    const scheduleData = req.body;
    try {
      const updatedSchedule = await ScheduleService.update(id, scheduleData);
      if (!updatedSchedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.status(200).json({
        message: 'Schedule updated successfully',
        data: updatedSchedule,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  // Delete schedule
  static async delete(req, res) {
    const { id } = req.params;
    try {
      const deletedSchedule = await ScheduleService.delete(id);
      if (!deletedSchedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.status(200).json({
        message: 'Schedule deleted successfully',
        data: deletedSchedule,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getSchedulesByDeviceId(req, res) {
    const {id} = req.params;

    try {
      console.log("cek",id)
      const schedules = await ScheduleService.getSchedulesByDeviceId(id);
      res.status(200).json({
        success: true,
        data: schedules,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = ScheduleController;
