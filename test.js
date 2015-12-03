'use strict';

var gutil = require('gulp-util');
var octopack = require('@robert.erez/octo-pack');
var sinon = require('sinon');
var expect = require('chai').expect;
var plugin = require('./');

describe('gulp-octo plugin', function(){

  it('should immediately throw if host not provided', function() {
    expect(function(){ plugin.pack(); }).to.throw('host details must be provided.');
  });

  it('should invoke `octo-pack.push`', function(done) {
    var pkg = new gutil.File({
      path: __dirname + '/bin/project.1.0.0.tar.gz',
      contents: new Buffer('tarcontents')
    });

    var spy = sinon.stub(octopack, 'push');
    spy.returns({then: function(succ){
      succ();
      return {done: function(){}};
    }});

    var packer = plugin.pack({host: 'http://example.org', apiKey: 'ABC'});

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