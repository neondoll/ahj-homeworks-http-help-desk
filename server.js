const http = require('http');
const Koa = require('koa');
const uuid = require('uuid');
const { koaBody } = require('koa-body');

const app = new Koa();

let tickets = [
  { id: uuid.v4(), name: 'Поменять краску в принтере, ком. 404', status: false, description: '', created: Date.now() },
  { id: uuid.v4(), name: 'Переустановить Windows, ПК-Hall24', status: false, description: '', created: Date.now() },
  {
    id: uuid.v4(),
    name: 'Установить обновление KB-XXX',
    status: true,
    description: 'Вышло критическое обновление для Windows, нужно поставить обновления в следующем приоритете:\n'
    + ' 1. Сервера (не забыть сделать бэкап!)\n'
    + ' 2. Рабочие станции',
    created: Date.now(),
  },
];

app.use(koaBody({ multipart: true, urlencoded: true }));
app.use((ctx, next) => {
  if (!(
    ctx.request.method === 'GET'
    && 'method' in ctx.request.query
    && ctx.request.query.method === 'allTickets'
  )) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, ctx.request.query);

  ctx.response.set('Access-Control-Allow-Origin', '*');

  ctx.response.body = JSON.stringify(tickets);
}); // GET ?method=allTickets
app.use((ctx, next) => {
  if (!(
    ctx.request.method === 'GET'
    && 'method' in ctx.request.query
    && ctx.request.query.method === 'deleteById'
  )) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, ctx.request.query);

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (!('id' in ctx.request.query)) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify('id must be specified in query');

    return;
  }

  const ticketIndex = tickets.findIndex(ticket => ticket.id === ctx.request.query.id);

  if (ticketIndex === -1) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify(`ticket with id ${ctx.request.query.id} was not found`);

    return;
  }

  tickets.splice(ticketIndex, 1);

  ctx.response.status = 204;
}); // GET ?method=deleteById&id=<id>
app.use((ctx, next) => {
  if (!(
    ctx.request.method === 'GET'
    && 'method' in ctx.request.query
    && ctx.request.query.method === 'ticketById'
  )) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, ctx.request.query);

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (!('id' in ctx.request.query)) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify('id must be specified in query');

    return;
  }

  const ticketIndex = tickets.findIndex(ticket => ticket.id === ctx.request.query.id);

  if (ticketIndex === -1) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify(`ticket with id ${ctx.request.query.id} was not found`);

    return;
  }

  ctx.response.body = JSON.stringify(tickets[ticketIndex]);
}); // GET ?method=ticketById&id=<id>
app.use((ctx, next) => {
  if (!(
    ctx.request.method === 'POST'
    && 'method' in ctx.request.query
    && ctx.request.query.method === 'createTicket'
  )) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, ctx.request.query);
  console.log(ctx.request.body);

  const { id, name, status, description } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (id !== 'null' && id !== 'undefined') {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify('id must be null or undefined');

    return;
  }

  if (status !== 'true' && status !== 'false') {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify('status must be boolean');

    return;
  }

  const newTicket = { id: uuid.v4(), name, status: status === 'true', description, created: Date.now() };

  tickets.push(newTicket);

  ctx.response.body = JSON.stringify({ id: newTicket.id });
}); // POST ?method=createTicket
app.use((ctx, next) => {
  if (!(
    ctx.request.method === 'POST'
    && 'method' in ctx.request.query
    && ctx.request.query.method === 'updateById'
  )) {
    next();

    return;
  }

  console.log(ctx.request.method, ctx.request.url, ctx.request.query);
  console.log(ctx.request.body);

  const { id, name, status, description } = ctx.request.body;

  ctx.response.set('Access-Control-Allow-Origin', '*');

  if (!('id' in ctx.request.query)) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify('id must be specified in query');

    return;
  }

  const ticketIndex = tickets.findIndex(ticket => ticket.id === ctx.request.query.id);

  if (ticketIndex === -1) {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify(`ticket with id ${ctx.request.query.id} was not found`);

    return;
  }

  if (status !== 'true' && status !== 'false') {
    ctx.response.status = 400;
    ctx.response.body = JSON.stringify('status must be boolean');

    return;
  }

  const ticket = { ...tickets[ticketIndex], id, name, status: status === 'true', description };

  tickets[ticketIndex] = ticket;

  ctx.response.body = JSON.stringify({ id: ticket.id });
}); // POST ?method=updateById&id=<id>
app.use((ctx) => {
  ctx.response.body = JSON.stringify('Hello Koa');
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
