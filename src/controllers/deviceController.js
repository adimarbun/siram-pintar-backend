const DeviceService = require('../services/deviceService');
const responseHelper = require('../helpers/responseHelper');
const PlantService = require('../services/plantService');

const DeviceController = {
  async createDevice(req, res) {
    try {
      const { plant_id, device_name, device_type } = req.body;
      const user_id = req.user.id; // Ambil user_id dari token

      // Validasi apakah plant_id milik user yang sedang login
      const plant = await PlantService.getPlantById(user_id, plant_id);
      if (!plant) {
        return responseHelper.error(res, 'Tanaman tidak ditemukan untuk user ini.', 404);
      }

      const device = await DeviceService.createDevice(plant_id, device_name, device_type);
      responseHelper.success(res, 'Device berhasil dibuat.', device, 201);
    } catch (error) {
      responseHelper.error(res, error.message, 400);
    }
  },

  async getDevices(req, res) {
    try {
      const user_id = req.user.id;
      const { plant_id } = req.query; // Ambil plant_id dari query params

      const plant = await PlantService.getPlantById(user_id, plant_id);
      if (!plant) {
        return responseHelper.error(res, 'Tanaman tidak ditemukan untuk user ini.', 404);
      }

      const devices = await DeviceService.getDevicesByPlant(plant_id);
      responseHelper.success(res, 'Data devices berhasil diambil.', devices);
    } catch (error) {
      responseHelper.error(res, error.message, 500);
    }
  },

  async getDeviceById(req, res) {
    try {
      const { id } = req.params;

      const device = await DeviceService.getDeviceById(id);
      if (!device) {
        return responseHelper.error(res, 'Device tidak ditemukan.', 404);
      }

      responseHelper.success(res, 'Data device berhasil diambil.', device);
    } catch (error) {
      responseHelper.error(res, error.message, 500);
    }
  },

  async updateDevice(req, res) {
    try {
      const { id } = req.params;
      const { device_name, device_type } = req.body;

      const updatedDevice = await DeviceService.updateDevice(id, device_name, device_type);
      if (!updatedDevice) {
        return responseHelper.error(res, 'Device tidak ditemukan.', 404);
      }

      responseHelper.success(res, 'Device berhasil diperbarui.', updatedDevice);
    } catch (error) {
      responseHelper.error(res, error.message, 400);
    }
  },

  async deleteDevice(req, res) {
    try {
      const { id } = req.params;

      const deletedDevice = await DeviceService.deleteDevice(id);
      if (!deletedDevice) {
        return responseHelper.error(res, 'Device tidak ditemukan.', 404);
      }

      responseHelper.success(res, 'Device berhasil dihapus.');
    } catch (error) {
      responseHelper.error(res, error.message, 400);
    }
  },

  async generateSensorHistory(req, res) {
    try {
      const { id: deviceId } = req.params;
      const filter = req.query.filter || '1 Hari';
  
      // Di dunia nyata, bisa validasi deviceId di DB
      const data = await DeviceController._mockSensorHistory(filter);
  
      responseHelper.success(res, 'Berhasil mengambil data histori sensor.', {
        deviceId,
        filter,
        data,
      });
    } catch (error) {
      responseHelper.error(res, error.message, 500);
    }
  },

  async _mockSensorHistory(filter) {
    const now = new Date();
    let data = [];
    let totalPoints = 24;

    if (filter === '7d') totalPoints = 7;
    else if (filter === '1m') totalPoints = 30;
    else if (filter === '1y') totalPoints = 12;

    for (let i = 0; i < totalPoints; i++) {
      const timestamp = new Date(now);
      if (filter === '1 Hari') {
        timestamp.setHours(now.getHours() - (totalPoints - i));
      } else {
        timestamp.setDate(now.getDate() - (totalPoints - i));
      }

      const value = Math.floor(Math.random() * 60) + 20; // range 20–80
      data.push({
        timestamp: timestamp.toISOString(),
        value,
      });
    }

    return data;
  }
};

module.exports = DeviceController;
