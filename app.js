const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/user');
const employeeRoutes = require('./routes/employee');

const app = express();

// Connecting to MongoDB
connectDB();

app.use(express.json());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// Starting server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
