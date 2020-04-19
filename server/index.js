'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');

const app = new Koa();
const router = require('./router');
const config = require('./config');

const PORT = config.port;

app.use(cors());
app.use(bodyParser());
app.use(router.routes());

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});