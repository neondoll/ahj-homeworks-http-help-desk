const getParams = require('./src/getParams');
const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
// const koaStatic = require('koa-static');
// const path = require('path');
const uuid = require('uuid');

const app = new Koa();

// app.use(koaStatic(path.join(__dirname, '/public')));

app.use(koaBody());
app.use((ctx, next) => {
  if (!(ctx.request.method === 'GET' && 'method' in ctx.request.query && ctx.request.query.method === 'allTickets')) {
    next();

    return;
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');

  console.log(ctx.request.method, ctx.request.url, ctx.request.query);

  ctx.body = JSON.stringify([
    {
      id: uuid.v4(),
      name: 'Поменять краску в принтере, ком. 404',
      status: false,
      description: '',
      created: Date.now(),
    },
    { id: uuid.v4(), name: 'Переустановить Windows, ПК-Hall24', status: false, description: '', created: Date.now() },
    { id: uuid.v4(), name: 'Установить обновление KB-XXX', status: true, description: '', created: Date.now() },
  ]);
}); // GET ?method=allTickets
app.use((ctx, next) => {
  const params = getParams(ctx.request.url);

  if (!(ctx.request.method === 'GET' && 'method' in params && params.method === 'deleteById')) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, params);

  ctx.body = JSON.stringify({});
}); // GET ?method=deleteById&id=<id>
app.use((ctx, next) => {
  const params = getParams(ctx.request.url);

  if (!(ctx.request.method === 'GET' && 'method' in params && params.method === 'ticketById')) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, params);
  console.log(ctx.request.query);

  ctx.body = JSON.stringify({});
}); // GET ?method=ticketById&id=<id>
app.use((ctx, next) => {
  const params = getParams(ctx.request.url);

  if (!(ctx.request.method === 'POST' && 'method' in params && params.method === 'createTicket')) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, params);

  ctx.body = JSON.stringify({});
}); // POST ?method=createTicket
app.use((ctx, next) => {
  const params = getParams(ctx.request.url);

  if (!(ctx.request.method === 'POST' && 'method' in params && params.method === 'updateById')) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, params);

  ctx.body = JSON.stringify({});
}); // POST ?method=updateById&id=<id>
app.use((ctx) => {
  ctx.body = 'Hello Koa';
});

const server = http.createServer(app.callback());

const port = process.env.PORT || 7070;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});
