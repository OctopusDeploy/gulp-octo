'use strict';

var octo = require('@robert.erez/octo-pack');
var path = require('path');
var PluginError = require('gulp-util').PluginError;
var log = require('plugin-log');
var through2    = require('through2');

var PLUGIN_NAME = 'gulp-octo';

function fileSizeString(bytes) {
  if(bytes < 1024) {
    return bytes + ' B';
  }

  var units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
  var u = -1;
  do {
    bytes /= 1024;
    ++u;
  } while(bytes >= 1024 && u < units.length - 1);
  return bytes.toFixed(2)+' '+units[u];
}

module.exports =  function(options) {
  if(!options || !options.host) {
    throw new Error('host details must be provided.');
  }


  function push(file, cb) {

    var pushOptions = {
      apikey: options.apiKey,
      replace: !!options.replace,
      host: options.host,
      verbose: false,
      name: path.basename(file.relative)
    };

    function fail(err) {
      var msg = err.statusMessage || err.statusCode;
      if (err && err.body && err.body.Errors && err.body.Errors[0]) {
        msg = err.body.Errors[0] + ' (' + err.statusCode + ')';
      }
      cb(new PluginError(PLUGIN_NAME, msg));
    }

    function success(body) {
      log('Pushed package', log.colors.cyan(body.Title + ' v'+ body.Version +' (' + fileSizeString(body.PackageSizeBytes) + ')'), 'to ', log.colors.cyan(options.host));
      cb(null, file);
    }

    octo.push(file.contents, pushOptions).then(success, fail).done();
  }

  return through2.obj(function (file, enc, cb) {

    if (file.relative === '' || file.isNull()) {
      cb();
      return;
    }
    push(file, cb);
  });
};
