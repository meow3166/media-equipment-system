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

router.get('/equipment/guide', (req, res) => {
    res.render('equipment/guide');
});

router.get('/board/notice', (req, res) => {
    res.render('board/notice');
});

router.get('/board/freeboard', (req, res) => {
    res.render('board/freeboard');
});

router.get('/board/qna', (req, res) => {
    res.render('board/qna');
});

router.get('/rental', (req, res) => {
    res.render('rental/index');
});

router.get('/mypage/profile', (req, res) => {
    res.render('mypage/profile');
});

router.get('/mypage/rental', (req, res) => {
    res.render('mypage/rental');
});

router.get('/mypage/warning', (req, res) => {
    res.render('mypage/warning');
});
module.exports = router;