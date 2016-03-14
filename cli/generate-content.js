#!/usr/local/bin/node

var fs = require('fs');
var path = require('path');

var contents = [];
fs.readdirSync('media/pics').forEach(function(file, idx) {
  var filepath = path.join('media/pics', file);

  var content = '<img class="content-item" src="' + filepath + '" alt="At Sea Image ' + idx + '" />';
  contents.push(content);
});

fs.writeFileSync('content.html', contents.join('\n'));
