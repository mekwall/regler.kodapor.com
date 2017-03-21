import fs from 'fs';
import path from 'path';
import {getContent, distDir, cssFile} from './app';

if (!fs.existsSync(distDir)){
  fs.mkdirSync(distDir);
}

var cssRead = fs.createReadStream(cssFile);
var cssWrite = fs.createWriteStream(path.join(distDir, 'styles.css'));
cssRead.pipe(cssWrite);
fs.writeFileSync(path.join(distDir, 'index.html'), getContent());

console.log('Assets built');
