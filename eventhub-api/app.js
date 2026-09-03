var express = require('express');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var searchRouter = require('./modules/search/searchRoutes');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true}));

app.use('/api', indexRouter);
app.use('/api', searchRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota nao encontrada.',
        errors: []
    });
});

module.exports = app;