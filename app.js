require('dotenv').config();

const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();

const session = require("express-session");
const authRouter = require("./routers/authRouter");
// 세션 미들웨어
// 테스트 안정화시 밑에 주석 해제하여 사용
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }));

//  테스트 안정화 위해 고정된 세션 시크릿 사용
const SESSION_SECRET = "mes-secret-key";

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.loginUser = req.session.user;
    next();
});

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
app.use("/auth", authRouter);

// 헬스체크
app.get('/ping', (req, res) => {
  res.send('pong');
});

// app만 내보내기
module.exports = app;