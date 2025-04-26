const express = require('express');
const venom = require('venom-bot');
const app = express();
app.use(express.json());

venom
  .create({
    session: 'mySession', // safer, future-proof
    multidevice: true, // optional, enables multi-device support
  })
  .then((client) => {
    app.post('/send', async (req, res) => {
      const { number, message, image } = req.body;
      try {
        if (image) {
          await client.sendImage(number, image, 'image.jpg', message);
        } else {
          await client.sendText(number, message);
        }
        res.json({ status: 'sent', number });
      } catch (error) {
        res.status(500).json({ status: 'error', message: error.toString() });
      }
    });

    app.listen(3000, () => console.log('Server running on http://localhost:3000'));
  })
  .catch((err) => {
    console.error('Error launching venom:', err);
  });
