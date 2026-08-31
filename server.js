const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Saari HTML, CSS aur JS files ko serve karo
app.use(express.static(path.join(__dirname, '.')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/page2', (req, res) => {
    res.sendFile(path.join(__dirname, 'page2.html'));
});

app.get('/page3', (req, res) => {
    res.sendFile(path.join(__dirname, 'page3.html'));
});

// ... Aise hi baaki pages (page4, page5, etc.) ke liye bhi likho

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
