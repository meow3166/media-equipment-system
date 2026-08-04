require("dotenv").config();

const path = require("path");
const express = require("express");
const nunjucks = require("nunjucks");
const session = require("express-session");

const authRouter = require("./routers/authRouter");
const adminRouter = require("./routers/adminRouter");

const app = express();

// 세션 미들웨어 — 한 번만 설정
app.use(session({
    secret: process.env.SESSION_SECRET || "mes-secret-key",
    resave: false,
    saveUninitialized: false
}));

// 템플릿에서 로그인 사용자와 쿼리스트링 사용
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.loginUser = req.session.user || null;
    res.locals.query = req.query;

    next();
});

// 요청 데이터 처리
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 뷰 엔진
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

nunjucks.configure(path.join(__dirname, "views"), {
    autoescape: true,
    express: app,
    watch: true
});

// 정적 파일
app.use(
    "/assets",
    express.static(path.join(__dirname, "views", "assets"))
);

// 라우터
app.use("/", require("./routers/public"));
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

// 헬스체크
app.get("/ping", (req, res) => {
    res.send("pong");
});

module.exports = app;