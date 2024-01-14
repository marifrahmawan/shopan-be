require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Import Route
const authRoute = require('./routes/AuthRouter');
const productRoute = require('./routes/ProductRouter');
const cartRoute = require('./routes/CartRouter');
const categoryRoute = require('./routes/CategoryRouter');

// API Endpoints
app.use('/api/auth', authRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/category', categoryRoute);

app.listen(PORT, async () => {
  try {
    console.log(`http://localhost:${PORT}`);
    mongoose.connection.on('connected', () => console.log('connected to database'));

    await mongoose.connect(process.env.MONGO_DB);
  } catch (error) {
    console.log(error);
  }
});
