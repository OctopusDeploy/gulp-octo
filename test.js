'use strict';

var Vinyl = require("vinyl");
var octopack = require('@octopusdeploy/octopackjs');
var sinon = require('sinon');
var expect = require('chai').expect;
var plugin = require('./');
var path = require('path');
var fs = require('fs');

describe('gulp-octo.push', function(){

  it('immediately throws if host not provided', function() {
    expect(function(){ plugin.push(); }).to.throw('host details must be provided.');
  });

  it('invokes `octo-pack.push`', function(done) {
    var pkg = new Vinyl({
      path: __dirname + '/bin/project.1.0.0.tar.gz',
      contents: Buffer.from('tarcontents')
    });

    var spy = sinon.stub(octopack, 'push').callsFake(function(contents, options, callback){
      callback(null, {Title: 'Title', Version: '1.0.0'});
    });

    var packer = plugin.push({host: 'http://example.org', apiKey: 'ABC'});

    packer.once('data', function() {
      var req = octopack.push.firstCall;
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

describe('gulp-octo.pack', function(callback) {

  it('uses package.json for package name default', function(cb) {
    var spy = sinon.stub(fs, 'readFileSync');
    spy.returns(JSON.stringify({version: '8.8', name: 'ProjectX'}));

    var stream = plugin.pack();

    stream.on('data', file => {
      expect(file.path).to.match(/ProjectX\.8\.8\.tar\.gz$/);
    });

    stream.on('end', cb);

    stream.write(new Vinyl({
      cwd: __dirname,
      base: path.join(__dirname, 'fixture'),
      path: path.join(__dirname, 'fixture/fixture.txt'),
      contents: Buffer.from('hello world')
    }));

    stream.end();
  });

  it('passes optional parameters to package name', function(cb) {
    var stream = plugin.pack({version: '2.3', id: 'MyPack'});

    stream.on('data', file => {
      expect(file.path).to.match(/MyPack\.2\.3\.tar\.gz$/);
    });

    stream.on('end', cb);

    stream.write(new Vinyl({
      cwd: __dirname,
      base: path.join(__dirname, 'fixture'),
      path: path.join(__dirname, 'fixture/fixture.txt'),
      contents: Buffer.from('hello world')
    }));

    stream.end();
  });
});