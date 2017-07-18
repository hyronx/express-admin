var x = null;

function count(args) {
  var s = args.statements;

  var str = [
    x.select(
      x.as(x.func('count','*'),x.name('count'))
    ),
    x.from(s.table),
    s.join,
    s.where,
    ';'
  ].join(' ');

  args.log && console.log('main'.cyan, str);
  args.query = str;
}

exports = module.exports = function (instance) {
  if (instance) x = instance;
  return {
    count:count
  }
}
