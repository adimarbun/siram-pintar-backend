const ScheduleModel = require('../models/scheduleModel');
const DynamicCronManager = require('../services/cronService'); 

class ScheduleService {
  static async create(scheduleData) {
  const {
    schedule: schedule_type,
    frequency,
    day_of_month,
    day_of_week, 
    watering_time,
    device_id,
    duration,
    threshold
  } = scheduleData;

  try {
    const days_of_week = day_of_week !== undefined ? [day_of_week] : [];

    const cronExpression = this.mapToCron(
      schedule_type,
      frequency,
      day_of_month,
      once_on_date,
      days_of_week,
      watering_time
    );

    const dataToSave = {
      ...scheduleData,
      schedule: cronExpression,
      schedule_type: frequency,
    };

    const newSchedule = await ScheduleModel.create(dataToSave);

    DynamicCronManager.addJob(
      newSchedule.device_id.toString(),  
      newSchedule.schedule,
      'checkMoisture',                    
      newSchedule.device_id,
      newSchedule.duration,
      newSchedule.threshold
    );

    return newSchedule;

  } catch (error) {
    throw new Error(`Failed to create schedule: ${error.message}`);
  }
}

  static async getAll() {
    try {
      return await ScheduleModel.getAll();
    } catch (error) {
      throw new Error(`Failed to fetch schedules: ${error.message}`);
    }
  }

  static async getSchedulesByDeviceId(deviceId) {
    try {
      const schedules = await ScheduleModel.getByDeviceId(deviceId);
      return schedules;
    } catch (error) {
      throw new Error('Gagal mengambil jadwal berdasarkan device_id');
    }
  }

  static async getById(id) {
    try {
      return await ScheduleModel.getById(id);
    } catch (error) {
      throw new Error(`Failed to fetch schedule by ID: ${error.message}`);
    }
  }

  static async update(id, scheduleData) {
    try {
      return await ScheduleModel.update(id, scheduleData);
    } catch (error) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      return await ScheduleModel.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete schedule: ${error.message}`);
    }
  }

  static mapToCron(scheduleType, frequency, dayOfMonth, onceOnDate, daysOfWeek, wateringTime) {
    const [hour, minute] = wateringTime.split(':').map(Number);

    switch (scheduleType) {
      case 'once':
        if (!onceOnDate) throw new Error('Tanggal harus diisi untuk jadwal sekali');
        const date = new Date(onceOnDate);
        return `${minute} ${hour} ${date.getDate()} ${date.getMonth() + 1} *`;

      case 'daily':
        return `${minute} ${hour} * * *`;

      case 'weekly':
        if (!daysOfWeek || daysOfWeek.length === 0)
          throw new Error('Hari dalam seminggu harus diisi');

        let dow;
        if (typeof daysOfWeek[0] === 'number') {
          dow = daysOfWeek[0]; 
        } else {
          const cronDays = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
          };
          dow = cronDays[daysOfWeek[0].toLowerCase()];
          if (dow === undefined) {
            throw new Error('Hari dalam seminggu tidak valid');
          }
        }

        return `${minute} ${hour} * * ${dow}`;

      case 'monthly':
        if (!dayOfMonth) throw new Error('Tanggal dalam bulan harus diisi');
        return `${minute} ${hour} ${dayOfMonth} * *`;

      default:
        throw new Error('Jenis jadwal tidak valid');
    }
  }
}

module.exports = ScheduleService;
