const express = require('express');
const venom = require('venom-bot');
const app = express();
app.use(express.json());

venom
  .create({
    session: 'mySession', // safer, future-proof
    multidevice: true, // optional, enables multi-device support
    headless: true, // <-- IMPORTANT: run without opening browser window
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'], // <-- make it work on server
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

    const PORT = process.env.PORT || 3000; // <-- important for Render
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error launching venom:', err);
  });
