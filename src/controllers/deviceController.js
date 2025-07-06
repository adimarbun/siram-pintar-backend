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
      console.log("err")
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
      const { startDate, endDate } = req.query;
      
      // Validasi format tanggal
      const isValidDate = d => d && !isNaN(new Date(d).getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(d);
      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return responseHelper.error(res, 'startDate dan endDate harus format YYYY-MM-DD', 400);
      }
      
      // Validasi device exists
      const device = await DeviceService.getDeviceById(deviceId);
      if (!device) {
        return responseHelper.error(res, 'Device tidak ditemukan', 404);
      }

      // Ambil data dari database
      const HistoryService = require('../services/historyService');
      const allHistories = await HistoryService.getHistoriesByDeviceAndDateRange(deviceId, startDate, endDate);
      
      // Ambil sample 10 data untuk grafik yang jelas
      const sampleData = DeviceController._getSampleData(allHistories, 10);
      
      responseHelper.success(res, 'Berhasil mengambil data histori sensor.', {
        deviceId,
        deviceName: device.device_name,
        startDate,
        endDate,
        totalRecords: allHistories.length,
        sampleSize: sampleData.length,
        data: sampleData,
      });
    } catch (error) {
      console.error('Error generating sensor history:', error);
      responseHelper.error(res, error.message, 500);
    }
  },

  _getSampleData(histories, sampleSize) {
    console.log(`🔍 Sampling ${sampleSize} data dari ${histories.length} total records`);
    
    if (histories.length <= sampleSize) {
      console.log(`📊 Data kurang dari ${sampleSize}, ambil semua data`);
      return histories.map(h => ({
        timestamp: h.timestamp,
        value: h.value
      }));
    }

    // Ambil sample yang merata dari seluruh data
    const step = Math.floor(histories.length / sampleSize);
    const sampleData = [];
    
    console.log(`📏 Step size: ${step} (${histories.length} / ${sampleSize})`);
    
    for (let i = 0; i < sampleSize; i++) {
      const index = i * step;
      if (index < histories.length) {
        const history = histories[index];
        sampleData.push({
          timestamp: history.timestamp,
          value: history.value
        });
      }
    }

    console.log(`✅ Berhasil mengambil ${sampleData.length} sample data`);
    return sampleData;
  }
};

module.exports = DeviceController;
