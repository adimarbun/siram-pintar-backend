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
  }
};

module.exports = HistoryController;
