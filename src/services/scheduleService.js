const ScheduleModel = require('../models/scheduleModel');

class ScheduleService {
  // Create a new schedule
  static async create(scheduleData) {
    const { schedule, frequency, day_of_month, once_on_date, watering_time } = scheduleData;

    try {
      // Map user input to cron-like expression with dynamic time
      const cronExpression = this.mapToCron(schedule, frequency, day_of_month, once_on_date, watering_time);

      const dataToSave = { ...scheduleData, schedule: cronExpression };

      return await ScheduleModel.create(dataToSave);
    } catch (error) {
      throw new Error(`Failed to create schedule: ${error.message}`);
    }
  }

  // Retrieve all schedules
  static async getAll() {
    try {
      return await ScheduleModel.getAll();
    } catch (error) {
      throw new Error(`Failed to fetch schedules: ${error.message}`);
    }
  }

  // Retrieve a schedule by ID
  static async getById(id) {
    try {
      return await ScheduleModel.getById(id);
    } catch (error) {
      throw new Error(`Failed to fetch schedule by ID: ${error.message}`);
    }
  }

  // Update a schedule by ID
  static async update(id, scheduleData) {
    try {
      return await ScheduleModel.update(id, scheduleData);
    } catch (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
  }

  // Delete a schedule by ID
  static async delete(id) {
    try {
      return await ScheduleModel.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete schedule: ${error.message}`);
    }
  }

  static mapToCron(schedule, frequency, day_of_month, once_on_date, watering_time) {
    // Parsing watering_time (misalnya "05:05")
    const [hour, minute] = watering_time.split(':');

    switch (schedule) {
      case 'everyday':
        return `${minute} ${hour} * * *`; // Setiap hari pada jam 05:05
      case 'weekly':
        return `${minute} ${hour} * * 1`; // Setiap Senin pada jam 05:05
      case 'monthly':
        return `${minute} ${hour} ${day_of_month || 1} * *`; // Setiap tanggal tertentu dalam bulan pada jam 05:05
      case 'once':
        if (once_on_date) {
          // Jika schedule = once, gunakan watering_time untuk menentukan jam dan menit
          const date = new Date(once_on_date);
          return `${minute} ${hour} ${date.getDate()} ${date.getMonth() + 1} *`; // Tanggal spesifik dengan waktu dari watering_time
        }
        throw new Error('Invalid once_on_date for "once" schedule.');
      default:
        throw new Error(`Unknown schedule type: ${schedule}`);
    }
  }


}

module.exports = ScheduleService;
