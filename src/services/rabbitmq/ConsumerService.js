require('dotenv').config();

const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const PlaylistsService = require('../postgres/PlaylistsService');
const CollaborationsService = require('../postgres/CollaborationsService');
const NotFoundError = require('../../exceptions/NotFoundError');

/**
 * ConsumerService: listens to RabbitMQ queue `export:playlists`,
 * fetches playlist data and emails the exported JSON to targetEmail.
 */
const ConsumerService = {
  startConsumer: async () => {
    try {
      const playlistsService = new PlaylistsService(new CollaborationsService());

      const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
      const secure = smtpPort === 465;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // verify transporter configuration
      transporter.verify((err, success) => {
        if (err) console.error('SMTP verify failed:', err);
        else console.log('SMTP ready to send messages');
      });

      const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      const channel = await connection.createChannel();
      const queue = 'export:playlists';

      await channel.assertQueue(queue, { durable: true });
      console.log(`Consumer listening on queue: ${queue}`);

      channel.consume(queue, async (msg) => {
        if (!msg) return;
        let content;
        try {
          content = JSON.parse(msg.content.toString());
        } catch (e) {
          console.error('Invalid message payload, dropping message', e);
          channel.ack(msg);
          return;
        }

        const { playlistId, targetEmail } = content || {};

        if (!playlistId || !targetEmail) {
          console.error('Malformed payload - missing playlistId or targetEmail:', content);
          channel.ack(msg);
          return;
        }

        console.log(`Received message for export: playlist='${playlistId}' -> '${targetEmail}'`);

        try {
          // fetch playlist metadata and songs
          const playlistMeta = await playlistsService.getPlaylistById(playlistId);
          const songs = await playlistsService.getPlaylistSong(playlistId);

          const payload = {
            playlist: {
              id: playlistMeta.id,
              name: playlistMeta.name,
              songs,
            },
          };

          const jsonContent = JSON.stringify(payload, null, 2);

          const mailOptions = {
            from: process.env.SMTP_USER,
            to: targetEmail,
            subject: `Export Playlist: ${playlistMeta.name}`,
            text: `Berikut file export playlist ${playlistMeta.name}`,
            attachments: [
              {
                filename: `playlist-${playlistId}.json`,
                content: jsonContent,
                contentType: 'application/json',
              },
            ],
          };

          await transporter.sendMail(mailOptions);
          channel.ack(msg);
          console.log(`Export email sent for playlist ${playlistId}`);
        } catch (err) {
          // If playlist not found, acknowledge to avoid endless requeue
          if (err instanceof NotFoundError) {
            console.warn(`Playlist not found (${playlistId}), acknowledging and dropping message`);
            channel.ack(msg);
            return;
          }

          console.error('Error processing message, will requeue:', err);
          channel.nack(msg, false, true);
        }
      });

      connection.on('error', (err) => {
        console.error('RabbitMQ connection error', err);
      });

      connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        process.exit(0);
      });
    } catch (error) {
      console.error('Failed to start consumer', error);
      process.exit(1);
    }
  },
};

module.exports = ConsumerService;
