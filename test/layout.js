var fs = require('fs');
var tree = require('..');
var through = require('through2');
var test = require('tap').test;

var expected = require(__dirname + '/expected.json');

test('table', function (t) {
  t.plan(expected.length);
  fs.createReadStream(__dirname + '/layout.html')
    .pipe(tree())
    .pipe(through.obj(function (row, enc, cb) {
      var exp = expected.shift();
      t.deepEqual(row, exp);
      cb();
    }));
});