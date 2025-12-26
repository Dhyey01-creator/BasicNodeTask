const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');

const {connectToMongoDB} = require('./connect');
const app = express();

const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');
const adminRoutes = require('./routes/admin');

connectToMongoDB('mongodb://localhost:27017/mydatabase')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/admin', adminRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
