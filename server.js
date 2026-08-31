const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Sabse Important Line: Ye saari files (html, css, images) ko serve karegi
app.use(express.static(path.join(__dirname, '.')));

// Route for Index
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Routes for other pages
app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, 'page2.html'));
});

app.get('/page3', (req, res) => {
    res.sendFile(path.join(__dirname, 'page3.html'));
});

app.get('/page4', (req, res) => {
    res.sendFile(path.join(__dirname, 'page4.html'));
});

app.get('/page5', (req, res) => {
    res.sendFile(path.join(__dirname, 'page5.html'));
});

app.get('/page6', (req, res) => {
    res.sendFile(path.join(__dirname, 'page6.html'));
});

app.get('/page7', (req, res) => {
    res.sendFile(path.join(__dirname, 'page7.html'));
});

app.get('/page8', (req, res) => {
    res.sendFile(path.join(__dirname, 'page8.html'));
});

app.get('/page9', (req, res) => {
    res.sendFile(path.join(__dirname, 'page9.html'));
});

app.get('/page10', (req, res) => {
    res.sendFile(path.join(__dirname, 'page10.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
