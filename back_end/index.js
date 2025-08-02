require('dotenv').config();
require('./config/dbconnect');
const express = require('express');
const app = express();
const port = process.env.PORT;
const routes = require('./routes/index');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const corsOptions = { origin: 'http://localhost:5173', credentials: true };

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/image', express.static('public/userimage'));
app.use('/api', routes);

app.listen(port, () => {
  console.log('server start!', port);
});
