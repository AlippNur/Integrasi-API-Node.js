const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/tambah', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'Entry.html'));
});

router.get('/edit', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'ubah.html'));
});

router.get('/detail', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'Detail.html'));
});

module.exports = router;