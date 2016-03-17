#!/usr/local/bin/node

var fs = require('fs');
var path = require('path');

var args = process.argv.slice(2);

if (args.length === 0) {
  console.log('need a media directory');
  return;
}

var prefix = args.length > 1 ? args[1] : Math.floor(Math.random() * 100000);

var dir = args[0];

fs.readdirSync(dir).forEach(function(file, idx) {
  var filepath = path.join(dir, file);

  var extension = path.extname(file);
  var newPath = path.join(dir, prefix + '-' + idx + extension);

  fs.renameSync(filepath, newPath);
});
