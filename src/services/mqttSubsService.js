const mqtt = require('mqtt');

// Connect to the broker
// const client = mqtt.connect('mqtt://broker.hivemq.com'); // Replace with your broker URL

const client = mqtt.connect('mqtt://103.127.97.2:1883'); // Replace with your broker URL
// Event: When connected
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    
    // Subscribe to a topic
    client.subscribe('home/garden/sensor', (err) => {
        if (!err) {
            console.log('Subscribed to topic: home/garden/sensor');
        } else {
            console.error('Failed to subscribe:', err);
        }
    });

    // Publish a message to a topic
    client.publish('home/garden/sensor', 'Hello MQTT');
});

// Event: When a message is received
client.on('message', (topic, message) => {
    console.log(`Message received on topic "${topic}": ${message.toString()}`);
});

// Handle connection errors
client.on('error', (err) => {
    console.error('Connection error:', err);
});
