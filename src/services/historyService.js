const HistoryModel = require('../models/historyModel');


const HistoryService = {
  async generateMockHistories(deviceId, filter) {
    const now = new Date();
    let totalPoints = 24;

    if (filter === '7d') totalPoints = 7;
    else if (filter === '1m') totalPoints = 30;
    else if (filter === '1y') totalPoints = 12;

    const data = [];

    for (let i = 0; i < totalPoints; i++) {
      const timestamp = new Date(now);
      if (filter === '1 Hari') {
        timestamp.setHours(now.getHours() - (totalPoints - i));
      } else {
        timestamp.setDate(now.getDate() - (totalPoints - i));
      }

      const value = Math.floor(Math.random() * 60) + 20; // 20–80
      data.push({ timestamp: timestamp.toISOString(), value });
    }

    await HistoryModel.bulkInsertHistories(deviceId, data);
    return data;
  },

  async getHistories(deviceId) {
    return await HistoryModel.getHistoriesByDevice(deviceId);
  },

  async createHistory(deviceId, timestamp, value) {
    return await HistoryModel.createHistory(deviceId, timestamp, value);
  }
};

module.exports = HistoryService;
