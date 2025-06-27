// controllers/historyController.js
const HistoryService = require('../services/historyService');

const HistoryController = {
  async createMock(req, res) {
    const { deviceId, filter } = req.body;

    if (!deviceId || !filter) {
      return res.status(400).json({ message: 'deviceId and filter are required' });
    }

    try {
      const data = await HistoryService.generateMockHistories(deviceId, filter);
      res.status(201).json({
        message: 'Mock sensor data generated and saved.',
        count: data.length,
        data
      });
    } catch (error) {
      console.error('Error creating mock history:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getByDevice(req, res) {
    const { deviceId } = req.params;

    try {
      const histories = await HistoryService.getHistories(deviceId);
      res.json(histories);
    } catch (error) {
      console.error('Error fetching histories:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async createHistory(req, res) {
    const { deviceId, value } = req.body;
    if (!deviceId || value === undefined) {
      return res.status(400).json({ message: 'deviceId, timestamp, and value are required' });
    }
    try {
      const data = await HistoryService.createHistory(deviceId, new Date(), value);
      res.status(201).json({
        message: 'Sensor history created successfully',
        data
      });
    } catch (error) {
      console.error('Error creating history:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  async getByDeviceAndDateRange(req, res) {
    const { deviceId } = req.params;
    const { startDate, endDate } = req.query;
    if (!deviceId || !startDate || !endDate) {
      return res.status(400).json({ message: 'deviceId, startDate, and endDate are required' });
    }
    try {
      // Get device info
      const DeviceModel = require('../models/deviceModel');
      const device = await DeviceModel.getDeviceById(deviceId);
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      const histories = await HistoryService.getHistoriesByDeviceAndDateRange(deviceId, startDate, endDate);
      const data = histories.map(h => ({
        tanggal: h.timestamp,
        value: h.value
      }));
      res.json({
        device_id: device.id,
        device_name: device.device_name,
        data
      });
    } catch (error) {
      console.error('Error fetching histories by date range:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

module.exports = HistoryController;
