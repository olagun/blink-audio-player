'use strict';

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.resolve(__dirname, 'build')));

app.get('/', (req, res, err) =>
    res.sendFile(path.resolve(__dirname, 'build/index.html')));

app.listen(port, () =>
    console.log(`Server running on port ${port}`));