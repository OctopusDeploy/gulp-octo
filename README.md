# gulp-octo

A gulp wrapper for [octopack](https://github.com/OctopusDeploy/octojs) library to push projects to Octopus Deploy

## Install

Install with [npm](https://npmjs.org/package/gulp-octo)

```
npm install --save-dev gulp-octo
```


## Example

```js
var gulp = require('gulp');
var octopush = require('gulp-octo').push;

// Simple publish with existing package
gulp.task('publish', function(){
    gulp.src('./bin/myproject.1.1.0.tar')
        .pipe(octopush({host: 'http://octopus-server/', apiKey: 'API-XXXXXXXXX'});
});

// Example creating tar from build artifacts before pushing
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');

gulp.task('packAndPublish', function() {
	var packageJson = require('./package.json');
	return gulp.src(['**/*', '!src/**/*', '!./gulpfile.js'])
			.pipe(tar(packageJson.name +'.'+ packageJson.version + '.tar'))
			.pipe(gzip())
			.pipe(octopush({host: 'http://octopus-server/', apiKey: 'API-XXXXXXXXX'});
});
```

## API

### octo.push(options)

## Options
### options.host
Required property that points to the Octopus Server instance the package should be pushed to.

## options.replace
Flag to force overwrite of existing packge if one already exists with the same ID and version.

### options.apiKey
Key linked to account with `BuiltInFeedPush` permissions. 
If `options.replace` is set to true and a package with the same ID and version already exists then the `BuiltInFeedAdminister` permission is required.

## Tests
```
npm test
```

## License

(MIT License)

Copyright (c) 2015 Octopus Deploy support@octopus.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

