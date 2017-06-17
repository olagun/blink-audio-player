'use strict';

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', (req, res, err) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});