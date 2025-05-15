const mqtt = require('mqtt')

const moistureData = {};

const generateDummyMoistureData = () => {
  const keyId = 'adi-sensor'; 
  const moisture = Math.floor(Math.random() * 100); 
  moistureData[keyId] = moisture;
  console.log(`Data dummy kelembapan untuk keyId ${keyId}: ${moisture}`);
};

setInterval(generateDummyMoistureData, 100000); 

function getMoistureByKeyId(keyId) {
  return moistureData[keyId] || null;
};

const mqttUrl = 'mqtt://103.127.97.2:1883'; 
const client = mqtt.connect(mqttUrl);

const topic = 'home/garden/sensor';

let isConnected = false;

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  isConnected = true;
});

client.on('error', (err) => {
  console.error('Error connecting to MQTT broker:', err);
  isConnected = false;
});

function publishToTopic(topic, message) {
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
// //for test
// setInterval(() => {
//   const keyId = 'sensor-19';
//   const moisture = Math.floor(Math.random() * 100);
//   moistureData[keyId] = moisture;

//   const payload = JSON.stringify({
//     device_key: keyId,
//     value: moisture
//   });

//   publishToTopic('Sensor', payload);
// }, 5000);

module.exports = {
  getMoistureByKeyId,
  publishToTopic
};
