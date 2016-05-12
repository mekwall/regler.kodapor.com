import fs from 'fs';
import Koa from 'koa';
import Markdown from 'markdown-it';

const md = new Markdown();
const app = new Koa();

const mdContent = fs.readFileSync('./src/content.md').toString();
const mdParsed = md.render(mdContent);

const html = `<doctype html>
<head>
  <meta charset="utf-8">
  <title>Kodapor</title>
  <style>
    body {
      font-family: "Comic Sans MS", "Comic Sans", cursive;
    }

    #container {
      width: 920px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div id="container">
    ${mdParsed}
  </div>
</body>
</html>
`;

const ETag = Date.now();

app.use((ctx) => {
  if (ctx.method === 'GET' && ctx.url === '/') {
    if (parseInt(ctx.headers['if-none-match'], 10) === ETag) {
      // Not modified
      ctx.status = 304;
      ctx.res.end();
      return;
    }
    // Ok
    ctx.set('ETag', ETag);
    ctx.type = 'html';
    ctx.body = html;
    return;
  }
  // Not found
  ctx.status = 404;
  ctx.body = '/dev/null';
});

var PORT = process.env.PORT || 3131;
app.listen(PORT, function () {
  var address = this.address();
  console.log(`Listening to ${address.port}`);
});
