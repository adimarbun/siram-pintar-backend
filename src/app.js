const express = require('express');
const bodyParser = require('body-parser');
const cronRoutes = require('./routes/cronRoutes');
const sensorRoutes = require('./routes/sensorRoutes')
const authRoutes = require('./routes/authRoutes')
const plantRoutes = require('./routes/plantRoutes')
const deviceRoutes = require('./routes/deviceRoutes')
const scheduleRoutes = require('./routes/scheduleRoutes');
const DynamicCronManager = require('./services/cronService');
// const ScheduleService = require('./services/scheduleService')
const historyRoutes = require('./routes/historyRoutes');
const mqttService = require('./services/mqttService')


const app = express();
const mqttSubsService = require('./services/mqttSubsService')
require('dotenv').config();
app.use(bodyParser.json());
app.use('/api/cron', cronRoutes);
app.use('/api/sensors',sensorRoutes );
app.use('/api/auth', authRoutes);
app.use('/api/plant', plantRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/history', historyRoutes);

app.get('/',(req,res) =>{
  res.send("Siram Pintar Backend Run")
})



// API untuk publish pesan ke MQTT
app.post('/api/publish', (req, res) => {
    const { plant_id, device_id, watering_time, action } = req.body;
  
    // Validasi input data
    if (!plant_id || !device_id || !watering_time || !action) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    // Membuat pesan yang akan dipublish
    const message = JSON.stringify({
      plant_id,
      device_id,
      action,
      watering_time
    });
  
    // Publish ke topik MQTT
    mqttService.publishToTopic('home/garden/sensor', message);
  
    // Kirim response sukses
    res.status(200).json({
      message: 'Message published successfully',
      data: { plant_id, device_id, watering_time, action }
    });
});







// Load cron jobs dari database saat server dimulai
DynamicCronManager.loadJobsFromDB();
// ScheduleService.loadJobsFromDB();

module.exports = app;



