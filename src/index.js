const express = require('express');
const { get } = require('axios');
const fs = require('fs');
const moment = require('moment');

const PORT = 9850;
const app = express();
const URL = 'https://kodaktor.ru/j/users';

const logger =  (req, res, next) => {
  fs.appendFile('log.txt', moment().format('DD.MM.YYYY HH:mm:ss') + ': ' + req.url + '\n', (err) => {
    if (err) throw err;
    console.log('update log!');
  });
  next();
};

app
  .use(logger)
  .get('/', r => r.res.send('lol kek chebureck!\n'))
  .get('/hello/', r => r.res.end('Hello word!\n'))
  .get('/log/', r => r.res.end(fs.readFileSync('log.txt')))
  .get('/hello/:name', r => r.res.end('Hello ' + r.params.name + '!\n'))

  // дыра в безопсности
  .get('/calc/:e', r => r.res.end(r.params.e + ' = ' + eval(r.params.e) + '\n'))

  .get('/users/', async r => {
  	const{data: {users: items}} = await get(URL);
  	r.res.render('list', {title: 'Login list', items});
  })

  .use(r => r.res.status(404).end('sorry :(\n'))
  .use((e, r, res, n) => res.status(500).end(`Error: ${e}`))
  .set('view engine', 'pug')
  .listen(process.env.PORT || PORT, () => console.log(process.pid));

