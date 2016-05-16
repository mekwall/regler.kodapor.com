import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import Markdown from 'markdown-it';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = process.env.NODE_ENV === 'development';
const srcDir = path.dirname(module.filename);

export const md = new Markdown({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '„“‚‘'
});
export const app = new Koa();

export const getContent = function () {
  const mdContent = fs.readFileSync(path.join(srcDir, 'content.md')).toString();
  const styles = fs.readFileSync(path.join(srcDir, 'styles.css').toString());
  const mdParsed = md.render(mdContent);
  const content = `<!doctype html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Kodapornas Regelverk">
    <meta property="og:description" content="Vilka regler som gäller för postande av inlägg och kommentarer.">
    <meta property="og:image" content="http://i.mekwall.se/ZQGRkZ94.jpg">
    <title>Kodapornas Regelverk</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,700" rel="stylesheet" type="text/css">
    <style>
      ${styles}
    </style>
  </head>
  <body>
    <div id="container">
      ${mdParsed}
    </div>
  </body>
  </html>
  `;
  return content;
}

var contentCache;
var eTag;

app.init = function () {
  contentCache = getContent();
  eTag = Date.now();
  return this;
};

app.use((ctx) => {
  if (ctx.method === 'GET' && ctx.url === '/') {
    if (!isDev && parseInt(ctx.header['if-none-match'], 0) === eTag) {
      // Not modified
      ctx.status = 304;
      ctx.res.end();
      return;
    }
    // Ok
    if (isDev) {
      ctx.set('X-Is-Development', true);
    } else {
      ctx.set('ETag', eTag);
    }
    ctx.type = 'html';
    ctx.body =  isDev || !contentCache ? getContent() : contentCache;
    return;
  }
  // Not found
  ctx.status = 404;
  ctx.body = 'request > /dev/null';
});

export default app;
