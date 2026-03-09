require('dotenv').config();

const ConsumerService = require('./services/rabbitmq/ConsumerService');

/**
 * Open Music Consumer App
 * Listens to RabbitMQ queue and processes async tasks like playlist exports
 */
const startConsumer = async () => {
  console.log('Starting Open Music Consumer...');
  try {
    await ConsumerService.startConsumer();
    console.log('Consumer started successfully');
  } catch (error) {
    console.error('Error starting consumer:', error);
    process.exit(1);
  }
};

// Start the consumer
startConsumer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing consumer');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing consumer');
  process.exit(0);
});
