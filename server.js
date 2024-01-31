const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use('/', express.static('public'));

const budget = require('./budget-data.json');

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// app.get('/budget', (req, res) => {
//     fs.readFile('budget-data.json', 'utf8', (data) => {
//         const budget = JSON.parse(data);
//             res.json(budget);
//     });
// });

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`App served at http://localhost:${port}`);
});