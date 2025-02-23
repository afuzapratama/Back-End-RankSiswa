// backend/server.js
require('dotenv').config(); // Memuat .env di awal

const app = require('./src/app');
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
