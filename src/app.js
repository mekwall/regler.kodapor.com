import fs from 'fs';
import path from 'path';
import Koa from 'koa';
import Markdown from 'markdown-it';

process.env.NODE_ENV = 'production'; //process.env.NODE_ENV || 'development';
export const isDev = process.env.NODE_ENV === 'development';
export const srcDir = path.dirname(module.filename);
export const distDir = path.resolve(srcDir, '../dist');
export const cssFile = path.join(srcDir, 'styles.css');
export const markdownFile = path.join(srcDir, 'content.md');

export const md = new Markdown({
  html: true,
  linkify: true,
  typographer: true,
  quotes: '„“‚‘'
});
export const app = new Koa();

export const getContent = function () {
  const mdContent = fs.readFileSync(markdownFile).toString();
  const styles = fs.readFileSync(cssFile).toString();
  const mdParsed = md.render(mdContent);
  const content = `<!doctype html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:type" content="website">
    <meta property="og:title" content="Kodapornas Regelverk">
    <meta property="og:description" content="Vilka regler som gäller för postande av inlägg och kommentarer.">
    <meta property="og:image" content="https://regler.kodapor.com/img/apa.jpg">
    <title>Kodapornas Regelverk</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,700" rel="stylesheet" type="text/css">
    <link href="styles.css" rel="stylesheet" type="text/css">
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-8137486-6', 'auto');
      ga('send', 'pageview');
    </script>
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
var lastModified;

app.init = function () {
  contentCache = getContent();
  lastModified = new Date();
  return this;
};

app.use((ctx) => {
  if (ctx.method === 'GET' && ctx.url === '/') {
    let isModifiedSince = ctx.headers['if-modified-since'] &&
      lastModified > new Date(ctx.headers['if-modified-since']);
    if (!isDev && lastModified) {
      ctx.status = 304;
      return;
    }
    // Ok
    if (isDev) {
      ctx.set('X-Is-Development', true);
    } else {
      ctx.set('Cache-Control', 'public');
      ctx.set('Last-Modified', lastModified);
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
