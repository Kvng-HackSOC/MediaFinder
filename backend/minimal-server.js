const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(5000, () => {
  console.log('Minimal server running on port 5000');
});