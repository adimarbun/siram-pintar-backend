const DeviceModel = require('../models/deviceModel');

const DeviceService = {
  async createDevice(plant_id, device_name, device_type) {
    return await DeviceModel.createDevice(plant_id, device_name, device_type);
  },

  async getDevicesByPlant(plant_id) {
    return await DeviceModel.getDevicesByPlant(plant_id);
  },

  async getDeviceById(device_id) {
    return await DeviceModel.getDeviceById(device_id);
  },

  async updateDevice(device_id, device_name, device_type) {
    return await DeviceModel.updateDevice(device_id, device_name, device_type);
  },

  async deleteDevice(device_id) {
    return await DeviceModel.deleteDevice(device_id);
  }
};

module.exports = DeviceService;
