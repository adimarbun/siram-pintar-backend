const cron = require('node-cron');
const CronModel = require('../models/cronModel');
const axios = require('axios'); // Untuk mengambil data sensor
const mqttService = require('./mqttService');
const ScheduleModel = require('../models/scheduleModel');
const { duration } = require('moment');
const DeviceModel = require('../models/deviceModel');

class DynamicCronManager {
  constructor() {
    this.jobs = {};
  }

  async loadJobsFromDB() {
    const jobs = await ScheduleModel.getAll();
    jobs.forEach((job) => {
      this.addJob(job.id, job.schedule, 'checkMoisture', job.device_id,job.duration,job.threshold);
    });
    console.log('Cron jobs telah dimuat dari database.');
  }

  addJob(name, schedule, task, device_id,duration,threshold) {
    if (this.jobs[name]) {
      this.jobs[name].stop();
      delete this.jobs[name];
    }

    this.jobs[name] = cron.schedule(schedule, async () => {
      console.log(`Task "${name}" dijalankan pada ${new Date().toLocaleString()}`);
      await this.runTask(task,device_id,duration,threshold);
    });

    console.log(`Cron job "${name}" ditambahkan dengan jadwal: ${schedule}`);
  }

  async saveJobToDB(name, schedule, task, options = {}) {
    await CronModel.addOrUpdateJob(name, schedule, task, options);
  }

  async removeJob(name) {
     console.log(`job :"${this.jobs[name]}" `)
    if (this.jobs[name]) {
      this.jobs[name].stop();
      delete this.jobs[name];
    }
  }

  listJobs() {
    return Object.keys(this.jobs);
  }

  async runTask(task,device_id,duration,threshold) {
    switch (task) {
      case 'checkMoisture':
        await this.handleMoistureCheck(device_id,duration,threshold);
        break;
      default:
        console.log(`Task "${task}" tidak dikenali.`);
    }
  }

  async handleMoistureCheck(device_id,duration,threshold) {
    const startTime = Date.now();
    const endTime = startTime + duration * 1000; // Durasi dalam milidetik

    console.log(`Memulai pengecekan kelembapan untuk keyId: ${device_id}, threshold: ${threshold}, duration: ${duration}s`);

    while (Date.now() < endTime) {
      try {
        const moisture = mqttService.getMoistureByKeyId(device_id);
        if (moisture === null) {
          console.log('Belum ada data kelembapan.');
        } else {
          console.log(`Kelembapan saat ini: ${moisture}`);
          if (moisture > threshold) {
            console.log('Kelembapan melebihi threshold, menghentikan pengecekan.');
            break;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Tunggu 1 detik sebelum pengecekan berikutnya
      } catch (error) {
        console.error('Gagal mendapatkan data kelembapan:', error.message);
        return;
      }
    }
    console.log('Proses selesai setelah mencapai durasi maksimum.');
    this.setDeviceOff(device_id)
  }

  async setDeviceOff(device_id){
    try{
        let device =  await DeviceModel.getDeviceById(device_id);
        await DeviceModel.updateDeviceStatus(device.device_key, false);
        const payload = JSON.stringify({
          device_key: device.device_key,
          status: 'OFF'
        });
        mqttService.publishToTopic('Pompa', payload);
    }catch(err){
      console.log("setDeviceOff",err)
    } 
  }
}

module.exports = new DynamicCronManager();
