const { test, before, after } = require('node:test');
const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const server = require('./server');

const port = 8123;

function request(pathname) {
  return new Promise((resolve, reject) => {
    http.get({ port, path: pathname }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    }).on('error', reject);
  });
}

before(async () => {
  await new Promise(res => server.listen(port, res));
});

after(async () => {
  await new Promise(res => server.close(res));
});

test('serves index page', async () => {
  const res = await request('/');
  const expected = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.data, expected);
});

test('serves about page', async () => {
  const res = await request('/about.html');
  const expected = fs.readFileSync(path.join(__dirname, 'public', 'about.html'), 'utf8');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.data, expected);
});

test('returns 404 for missing page', async () => {
  const res = await request('/missing.html');
  assert.strictEqual(res.statusCode, 404);
});
