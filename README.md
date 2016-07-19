# gulp-octo

> A Gulp wrapper for [octopack](https://github.com/OctopusDeploy/octopackjs) library to push projects to Octopus Deploy

## Install

Install with [npm](https://npmjs.org/package/@octopusdeploy/gulp-octo)

```shell
npm install --save-dev @octopusdeploy/gulp-octo
```

## API

### octo.pack(type, options)

#### type
Optional parameter to define the package type. Valid values are `targz`, `tar`, `zip` or `nupkg`. If not provided this defaults to `targz`.

#### options.id
Defines the `Id` component of the created package. By default it will extract the name out of `package.json` if present.

#### options.version
Defines the `version` component of the created package. By default it will extract the version out of `package.json` if present.

### octo.push(options)

#### options.host
Required property that points to the Octopus Server instance the package should be pushed to. Note that this is _not_ the full path of the package upload url, but just the root url of the server instance. The approprate path will be appended within in the push module.

#### options.replace
Flag to force overwrite of existing package if one already exists with the same ID and version.

#### options.apiKey
Key linked to account with `BuiltInFeedPush` permissions. 
If `options.replace` is set to true and a package with the same ID and version already exists then the `BuiltInFeedAdminister` permission is required.


## Usage Examples

#### Simple Pack
In this example, the default options are used to create a package and save to the bin directory.
```js
var gulp = require('gulp');
var octopack = require('@octopusdeploy/gulp-octo').pack;

// Simple package into bin directory
gulp.task('pack', function() {
    gulp.src(['**/*', '!src/**/*', '!bin/**/*','!./gulpfile.js'])
        .pipe(octopack())
		.pipe(gulp.dest('./bin'));
});
```

#### Simple Push
In this example, the default options are used to push a package that is generated from some other process. This example provide the minimum configuration options required to perform the push. 

```js
var gulp = require('gulp');
var octopush = require('@octopusdeploy/gulp-octo').push;

// Simple publish with existing package
gulp.task('publish', function() {
    gulp.src('./bin/myproject.1.1.0.tar')
        .pipe(octopush({host: 'http://octopus-server/', apiKey: 'API-XXXXXXXXX'});
});
```

#### Pack & Push
In this example, the project files are first packaged up into a `.tar.gz` file which is then piped directly to the push module. 

```js
var octo = require('@octopusdeploy/gulp-octo');

gulp.task('publish', function() {
	return gulp.src(['**/*', '!src/**/*', '!./gulpfile.js'])
			.pipe(octo.pack('tar.gz'))
			.pipe(octo.push({host: 'http://octopus-server/', apiKey: 'API-XXXXXXXXX'});
});
```


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

