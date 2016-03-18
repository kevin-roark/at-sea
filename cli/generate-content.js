#!/usr/local/bin/node

var fs = require('fs');
var path = require('path');

var contents = [];

var pics = fs.readdirSync('media/pics');
pics.sort(function() { return Math.random() - 0.5; });

pics.forEach(function(file, idx) {
  var filepath = path.join('media/pics', file);

  var content = '<img class="content-item" src="' + filepath + '" alt="At Sea Image ' + idx + '" />';
  contents.push(content);
});

fs.writeFileSync('content.html', contents.join('\n'));
