
var moment = require('moment');
var numeral = require('numeral');

exports.value = function (column, value) {
    if (/^(datetime|timestamp).*/i.test(column.type)) {
        if (column.control.fromNow) {
            return value ? moment(value).fromNow() : '';
        } else {
            return value ? moment(value).format(column.control.format || 'ddd MMM DD YYYY HH:mm:ss') : '';
        }
    }

    else if (/^date.*/i.test(column.type)) {
        if (column.control.fromNow) {
            return value ? moment(value).fromNow() : '';
        } else {
            return value ? moment(value).format(column.control.format || 'ddd MMM DD YYYY') : '';
        }
    }

    else if (/^decimal.*/i.test(column.type) && column.control.format) {
        return value ? numeral(value).format(column.control.format) : '';
    }

    else if (column.control.radio) {
        // mysql
        if (typeof value === 'number') {
            return (value == 1) // flip
                ? column.control.options[0]
                : column.control.options[1];
        }
        // pg
        if (typeof value === 'boolean') {
            return (value == true) // flip
                ? column.control.options[0]
                : column.control.options[1];
        }
    }

    else if (column.control.select) {
      return this.getActiveSingle(column, value);
    }

    else if (column.control.json) {
      return JSON.stringify(value);
    }

    else if (column.control.binary) {
        return value ? 'data:image/jpeg;base64,'+value.toString('base64') : value;
    }

    else {
        return value
    }
}

exports.getActiveSingle = function (column, value) {
  if (column.control.options) {
    for (var i=0; i < column.control.options.length; i++) {
      if (column.control.options[i][value]) {
        return column.control.options[i][value];
      }
    }
  }
  if (!column.value) return value;
  var rows = column.value;
  for (var i=0; i < rows.length; i++) {
    if (rows[i]['__pk'] == value) {
      return rows[i]['__text'];
    }
  }
  return 'Unknown';
}
