const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`서버 실행: http://localhost:${PORT}`);
});