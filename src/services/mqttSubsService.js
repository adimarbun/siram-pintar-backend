const mqtt = require("mqtt");
const DeviceService = require("./deviceService");
const HistoryModel = require("../models/historyModel");
const DeviceModel = require("../models/deviceModel");

// Connect to the broker
// const client = mqtt.connect('mqtt://broker.hivemq.com'); // Replace with your broker URL

const client = mqtt.connect("mqtt://sirampintar.site:1883"); // Replace with your broker URL
// Event: When connected
client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to a topic
  client.subscribe("home/garden/sensor", (err) => {
    if (!err) {
      console.log("Subscribed to topic: home/garden/sensor");
    } else {
      console.error("Failed to subscribe:", err);
    }
  });

  // Publish a message to a topic
  client.publish("home/garden/sensor", "Hello MQTT");
});

client.subscribe(["Sensor", "Pompa", "Sensor/Log"], (err) => {
  if (!err) {
    console.log("Subscribed to multiple topics");
  }
});

// Event: When a message is received
client.on("message", async (topic, message) => {
  console.log(`Message received on topic "${topic}": ${message.toString()}`);

  if (topic === "Pompa") {
    try {
      const payload = JSON.parse(message.toString());
      const { device_key, status } = payload;
      const isOn = status === "ON";
      await DeviceService.updateDeviceStatus(device_key, isOn);
    } catch (error) {
      console.error("Failed to update device status:", error);
    }
  }
  if (topic === "Sensor") {
    try {
    } catch (error) {
      console.error("Failed to update device status:", error);
    }
  }
  if (topic === "Sensor/Log") {
    try {
      const payload = JSON.parse(message.toString());
      const sensors = [payload.moisture1, payload.moisture2, payload.ph];
      for (const sensor of sensors) {
        if (!sensor || !sensor.device_key) continue;
        try {
          const device = await DeviceModel.getDeviceByKey(sensor.device_key);
          if (!device) {
            console.error(`Device not found for key: ${sensor.device_key}`);
            continue;
          }
          let value = sensor.value;
          // Jika device_key mengandung 'ph', pastikan value float
          if (sensor.device_key.toLowerCase().includes('ph')) {
            value = parseFloat(sensor.value);
          }
          await HistoryModel.createHistory(device.id, new Date(), value);
          console.log(`History saved for device_key: ${sensor.device_key}, value: ${value}`);
        } catch (err) {
          console.error(`Failed to save history for device_key: ${sensor.device_key}`, err);
        }
      }
    } catch (error) {
      console.error("Failed to process Sensor/Log message:", error);
    }
  }
});

// Handle connection errors
client.on("error", (err) => {
  console.error("Connection error:", err);
});

// // Publish dummy log data every 2 minutes (120000 ms) dummy data
// setInterval(() => {
//   // Generate random dummy values
//   const raw1 = Math.floor(Math.random() * 4096);
//   const raw2 = Math.floor(Math.random() * 4096);
//   const rawPH = Math.floor(Math.random() * 4096);

//   // Simulate mapping and voltage calculation
//   const sensorDry = 0;
//   const sensorWet = 4095;
//   let moisture1 = Math.floor(((raw1 - sensorDry) / (sensorWet - sensorDry)) * 100);
//   let moisture2 = Math.floor(((raw2 - sensorDry) / (sensorWet - sensorDry)) * 100);
//   moisture1 = Math.max(0, Math.min(100, moisture1));
//   moisture2 = Math.max(0, Math.min(100, moisture2));

//   const voltage1 = (raw1 / 4095.0) * 3.3;
//   const voltage2 = (raw2 / 4095.0) * 3.3;
//   const voltagePH = (rawPH / 4095.0) * 3.3;
//   const phValue = (Math.random() * 7 + 3).toFixed(2); // Simulate pH 3-10

//   const log = {
//     type: "log",
//     moisture1: {
//       value: moisture1,
//       raw: raw1,
//       voltage: voltage1,
//       device_key: "sensor-19"
//     },
//     moisture2: {
//       value: moisture2,
//       raw: raw2,
//       voltage: voltage2,
//       device_key: "sensorkelembapan-32"
//     },
//     ph: {
//       value: phValue,
//       raw: rawPH,
//       voltage: voltagePH,
//       device_key: "sensorph-20"
//     }
//   };

//   client.publish("Sensor/Log", JSON.stringify(log));
//   console.log("Dummy log published to Sensor/Log");
// }, 60000); // 2 minutes
