'use strict';

var gutil = require('gulp-util');
var octopack = require('@robert.erez/octo-pack');
var sinon = require('sinon');
var expect = require('chai').expect;
var plugin = require('./');
var path = require('path');
var fs = require('fs');
var vinylMap = require('vinyl-map');

describe('gulp-octo.push', function(){

  it('immediately throws if host not provided', function() {
    expect(function(){ plugin.push(); }).to.throw('host details must be provided.');
  });

  it('invokes `octo-pack.push`', function(done) {
    var pkg = new gutil.File({
      path: __dirname + '/bin/project.1.0.0.tar.gz',
      contents: new Buffer('tarcontents')
    });

    var spy = sinon.stub(octopack, 'push');
    spy.returns({then: function(succ){
      succ({Title: 'Title', Version: '1.0.0'});
      return {done: function(){}};
    }});

    var packer = plugin.push({host: 'http://example.org', apiKey: 'ABC'});

    packer.once('data', function(){
      expect(spy.calledOnce);

      var pushOptions = spy.firstCall.args;
      expect(pushOptions[0]).to.equal(pkg.contents);
      expect(pushOptions[1].apikey).to.equal('ABC');
      expect(pushOptions[1].host).to.equal('http://example.org');
      expect(pushOptions[1].name).to.equal('project.1.0.0.tar.gz');
      return done();
    });
    packer.end(pkg);
  });

});

describe('gulp-octo.pack', function() {

  it('uses package.json for package name default', function(cb) {
    var spy = sinon.stub(fs, 'readFileSync');
    spy.returns(JSON.stringify({version: '8.8', name: 'ProjectX'}));

    var stream = plugin.pack();

    addFileAndPipe(stream, function (code, filename) {
      expect(filename).to.match(/ProjectX\.8\.8\.tar\.gz$/);
      cb();
    });
  });

  it('passes optional parameters to package name', function(cb) {
    var stream = plugin.pack({version: '2.3', id: 'MyPack'});

    addFileAndPipe(stream, function (code, filename) {
      expect(filename).to.match(/MyPack\.2\.3\.tar\.gz$/);
      cb();
    });
  });

  function addFileAndPipe(stream, cb){
    stream.write(new gutil.File({
      cwd: __dirname,
      base: path.join(__dirname, 'fixture'),
      path: path.join(__dirname, 'fixture/fixture.txt'),
      contents: new Buffer('hello world')
    }));

    var evaluate = vinylMap(cb);

    stream.end();
    stream.pipe(evaluate);
  }
});