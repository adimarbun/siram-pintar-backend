const mqtt = require("mqtt");
const DeviceService = require("./deviceService");

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

client.subscribe(["Sensor", "Pompa"], (err) => {
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
});

// Handle connection errors
client.on("error", (err) => {
  console.error("Connection error:", err);
});
