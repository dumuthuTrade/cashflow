const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Basic server running on port ${PORT}`);
});
