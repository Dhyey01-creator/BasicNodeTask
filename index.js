const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');

const {connectToMongoDB} = require('./connect');
const { connect } = require('http2');

const app = express();

connectToMongoDB('mongodb://localhost:27017/mydatabase')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
