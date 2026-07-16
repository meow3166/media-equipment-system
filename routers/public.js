const express = require('express');
const router = express.Router();

// 메인 페이지
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/equipment', (req, res) => {
    res.render('equipment/index');
});

router.get('/equipment/status', (req, res) => {
    res.render('equipment/status');
});
module.exports = router;