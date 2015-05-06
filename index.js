var through = require('through2');
var combine = require('stream-combiner2');
var tokenize = require('tokenize-html');

module.exports = function () {
  return combine(tokenize(), parse());
};

var IN_TEXT = 0, IN_TAG = 1,
    TAG = 0, ATTRS = 1, CHILDREN = 2, PARENT = 3;

function parse () {
  var state = IN_TEXT, cursor = null,
      node;

  return through.obj(function (row, enc, next) {
    switch (row.shift()) {
      case 'open':
        node = row.concat([ [], cursor ? cursor : null ]);
        if (state == IN_TEXT)
          state = IN_TAG;
        else
          cursor[CHILDREN].push(node);
        cursor = node;
      break;
      case 'close':
        node = cursor;
        if (cursor[PARENT] === null) {
          state = IN_TEXT;
          cursor = null;
          this.push(node.slice(0, -1));
        } else {
          state = IN_TAG;
          cursor = cursor[PARENT];
          node.splice(-1, 1);
        }
      break;
      case 'text':
        if (state == IN_TEXT) {
          if (row[0].match(/^[\s\xa0]+$/g))
            break;
          else
            throw new Error('top-level text node');
        } else
          cursor[CHILDREN].push(row[0]);
      break;
    }
    next();
  });
}