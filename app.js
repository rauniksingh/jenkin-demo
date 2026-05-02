const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('CI/CD Pipeline Working with Jenkins 🚀🚀');
});

app.listen(3000, () => console.log('Server running'));