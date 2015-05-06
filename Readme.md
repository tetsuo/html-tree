# html-tree

transform stream to parse html into parse-trees.

# example

```js
var fs = require('fs');
var through = require('through2');
var tree = require('html-tree');

fs.createReadStream(__dirname + '/layout.html')
  .pipe(tree())
  .pipe(through.obj(function (row, enc, next) {
    console.log(row);
    next();
  }))
;
```

this html:

```html
<h1>title</h1>

<div class="xyz">
  <span>blah blah <b>blah</b></span>
</div>

<table>
  <tr><td>there</td></tr>
  <tr><td>it</td></tr>
  <tr><td bgcolor="blue">is</td></tr>
</table>
```

generates this output:

```
[ 'h1', {}, [ 'title' ] ]
[ 'div',
  { class: 'xyz' },
  [ '\n  ',
    [ 'span', {}, [ 'blah blah ', [ 'b', {}, [ 'blah' ] ] ] ],
    '\n' ] ]
[ 'table',
  {},
  [ '\n  ',
    [ 'tr', {}, [ [ 'td', {}, [ 'there' ] ] ] ],
    '\n  ',
    [ 'tr', {}, [ [ 'td', {}, [ 'it' ] ] ] ],
    '\n  ',
    [ 'tr', {}, [ [ 'td', { bgcolor: 'blue' }, [ 'is' ] ] ] ],
    '\n' ] ]
```

# api

## var t = tree()

Returns a transform stream `t` that takes html input and produces rows
of output. The output rows are of the form:

* `[ tag, attrs, children ]`

Top-level text nodes are not allowed.

# license

mit