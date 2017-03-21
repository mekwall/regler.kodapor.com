import test from 'ava';
import fs from 'fs';
import {md, getContent, app} from '../src/server';
import superagent from 'superagent';

test.cb('Content file exists', t => {
  fs.stat('../src/content.md', (err) => {
    if (err) return t.fail();
    t.pass();
    t.end();
  });
});

test('Parse markdown', t => {
  try {
    var content = getContent();
    t.pass();
  } catch (e) {
    console.error(e.stack);
    t.fail();
  }
});

var expectedContent = getContent();
var PORT = process.env.PORT || 3131;

test.serial.cb('Listen for connections', t => {
  app.init().listen(PORT, function () {
    app.server = this;
    var address = this.address();
    t.plan(1);
    t.is(address.port, PORT);
    t.end();
  });
});

test.serial.cb('Serve content', t => {
  superagent.get(`http://localhost:${PORT}/`)
    .end((err, res) => {
      if (err) return t.fail();
      t.plan(3);
      t.truthy(res, 'response exists');
      t.is(res.status, 200);
      t.is(res.text, expectedContent);
      t.end();
    });
});
