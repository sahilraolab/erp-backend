// const express = require('express');
// const cors = require('cors');

// const app = express();

// app.use(cors({
//   origin: 'http://localhost:8080',
//   // origin: 'http://localhost:3001',
//   // origin: 'https://id-preview--5f6b5952-2b85-4e78-9735-6a09d91d7487.lovable.app',
//   // origin: 'https://id-preview--4fe97fa2-dc95-4a45-9a3f-fce2c47394ce.lovable.app',
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

// app.use(express.json());

// // Handle preflight explicitly (important)
// app.options('*', cors());

// app.get('/', (req, res) => {
//   res.json({
//     status: 'OK',
//     message: 'Construction ERP Backend is running 🚀',
//     timestamp: new Date()
//   });
// });

// require('./routes')(app);

// module.exports = app;


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

/* ================= CORS ================= */
app.use(cors({
  origin: true, // 👈 allow same-origin in production
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.options('*', cors());

/* ================= API ROUTES ================= */
require('./routes')(app);

/* ================= FRONTEND (REACT BUILD) ================= */
app.use(express.static(path.join(__dirname, '../public')));

// SPA fallback — MUST be last
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
