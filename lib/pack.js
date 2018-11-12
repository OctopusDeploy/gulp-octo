'use strict';

var octo = require('@octopusdeploy/octojs');
var gutil = require('gulp-util');
var through = require('through2');
var log = require('plugin-log');
var path = require('path');

var PLUGIN_NAME = 'gulp-octo.pack';

module.exports = function (type, options) {
  var files = [];
  var firstFile;
  if(typeof type === 'object') {
    options = type;
    type = 'targz';
  }


  return through.obj(
    function (file, enc, cb) {
      if (file.relative !== '') {
        if (firstFile === undefined) {
          firstFile = file;
        }
        files[file.relative] = file;
      }
      cb();
    },
    function (cb) {

        var pack = octo.pack({format: type || 'targz', bypassDisk: true}, function (err, data) {

            if (err) {
                cb(new gutil.PluginError(PLUGIN_NAME, err));
                return;
            }
            if (!Object.keys(files).length) {
                cb(new gutil.PluginError(PLUGIN_NAME, 'No files were found to add to package'));
                return;
            }


            var packFile = firstFile.clone({contents: false});
            packFile.path = path.join(packFile.base, data.name);
            packFile.contents = data.stream;
            data.stream.push(packFile);

            log('Packed \'' + log.colors.cyan(data.name) + '\' with ' + log.colors.magenta(Object.keys(files).length + ' files'));
            cb();

        });

        Object.keys(files).sort().forEach(function (f) {
            var file = files[f];

            pack.append(file.relative.replace(/\\/g, '/') + (file.isNull() ? '/' : ''), file.contents || file.base, {
                mode: file.stat && file.stat.mode,
                date: file.stat && file.stat.mtime ? file.stat.mtime : null
            });
        });
    });
};
