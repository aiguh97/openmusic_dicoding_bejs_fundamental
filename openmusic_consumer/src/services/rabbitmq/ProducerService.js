const amqp = require('amqplib');

/**
 * ProducerService is a service that will be used to send a message to the queue.
 */
const ProducerService = {
    /**
     * sendMessage is a function that will be used to send a message to the queue.
     */
    sendMessage: async (queue, message) => {
        let connection;
        try {
            connection = await amqp.connect(process.env.RABBITMQ_SERVER);
            const channel = await connection.createChannel();
            await channel.assertQueue(queue, {
                durable: true,
            });

            await channel.sendToQueue(queue, Buffer.from(message));
            console.log(`Producer: message sent to queue '${queue}': ${message}`);
        } catch (err) {
            console.error('Producer: failed to send message', err);
            throw err;
        } finally {
            if (connection) {
                setTimeout(() => {
                    try {
                        connection.close();
                    } catch (e) {
                        // ignore
                    }
                }, 500);
            }
        }
    },
};

module.exports = ProducerService;
