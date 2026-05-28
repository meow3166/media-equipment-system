require('dotenv').config();

const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

// 미들웨어
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 뷰 엔진
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

nunjucks.configure(path.join(__dirname, 'views'), {
  autoescape: true,
  express: app,
  watch: true
});

// 정적 파일
app.use('/assets', express.static(path.join(__dirname, 'views', 'assets')));

// 라우터
app.use('/', require('./routers/public'));

// 헬스체크
app.get('/ping', (req, res) => {
  res.send('pong');
});

// app만 내보내기
module.exports = app;