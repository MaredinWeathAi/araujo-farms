const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from /public with sensible caching for media
app.use(
  express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
      if (/\.(jpg|jpeg|png|webp|mp4|woff2?)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days
      }
    },
  })
);

// SPA-style fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Araujo Farms site running on port ${PORT}`);
});
