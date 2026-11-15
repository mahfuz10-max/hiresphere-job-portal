const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { sendResponse } = require('./utils/apiResponse');
const { ensureAdditionalJobs } = require('./utils/ensureAdditionalJobs');

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing in server/.env');
  process.exit(1);
}

const app = express();

connectDB().then(() => {
  ensureAdditionalJobs();
});

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  sendResponse(res, 200, true, 'HireSphere API is running.', {
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved', require('./routes/savedJobRoutes'));
app.use('/api/employer', require('./routes/employerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use((req, res) => {
  sendResponse(res, 404, false, `Route ${req.originalUrl} not found.`);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HireSphere server listening on http://localhost:${PORT}`);
});
