const mqtt = require('mqtt')
// Simulasi data kelembapan
const moistureData = {};
const generateDummyMoistureData = () => {
  const keyId = 'adi-sensor'; // Ganti dengan keyId yang sesuai
  const moisture = Math.floor(Math.random() * 100); // Simulasikan nilai kelembapan antara 0 dan 100
  moistureData[keyId] = moisture;
  console.log(`Data dummy kelembapan untuk keyId ${keyId}: ${moisture}`);
};

// Simulasikan pengiriman data setiap detik
setInterval(generateDummyMoistureData, 100000); // Mengirim data dummy setiap 1 detik

// Fungsi untuk mendapatkan data kelembapan berdasarkan keyId
function getMoistureByKeyId(keyId) {
  console.log("data ========>",moistureData);
  return moistureData[keyId] || null;
}


;

// Koneksi ke broker MQTT
const mqttUrl = 'mqtt://103.127.97.2:1883'; // Ganti dengan URL broker MQTT yang sesuai
const client = mqtt.connect(mqttUrl);

// Topik yang akan digunakan untuk publish
const topic = 'home/garden/sensor';

// Status koneksi
let isConnected = false;

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  isConnected = true;
});

client.on('error', (err) => {
  console.error('Error connecting to MQTT broker:', err);
  isConnected = false;
});

// Fungsi untuk publish pesan ke topik
function publishToTopic(topic, message) {
  // Pastikan kita hanya publish pesan jika koneksi berhasil
  if (isConnected) {
    client.publish(topic, message, (err) => {
      if (err) {
        console.error(`Failed to publish message: ${err.message}`);
      } else {
        console.log(`Message published to topic ${topic}: ${message}`);
      }
    });
  } else {
    console.error('Unable to publish message, MQTT client is not connected');
  }
}


module.exports = {
  getMoistureByKeyId,
  publishToTopic
};
