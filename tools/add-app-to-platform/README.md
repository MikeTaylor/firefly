# add-app-to-platform

<!-- md2toc -l 2 README.md -->
* [Overview](#overview)
* [Logging](#logging)


## Overview

[`add-app-to-platform.js`](add-app-to-platform.js) is an attempt to capture the manual steps of adding an app to a platform in code -- at this stage, not so much in the hope that it will be useful, more in an attempt to find out where the gaps are. It is driven by a single FAM file, which may be obtained via the WSAPI provided by [`mod-app-manager`](https://github.com/MikeTaylor/mod-app-manager) or by any other method.


## Invocation

`add-app-to-platform` is invoked using `babel-node` to interpret ES6 features in JavaScript. The only command-line argument is the name of a [FAM (FOLIO Application Metadata) file](../../doc/folio-app-metadata.md). Use something like:

	babel-node --presets=env add-app-to-platform/add-app-to-platform.js ../examples/harvester-admin.fam

The following command-line options are supported:

* `-o` or `--orchestration=STRING` -- Use orchestration plugin (default: kubernetes)
* `-V` or `--version` -- Display the version number and exit
* `-h` or `--help` -- Display a full list of options


## Logging

`add-app-to-platform` uses [`categorical-logger`](https://github.com/openlibraryenvironment/categorical-logger) for logging. It logs messages in the categories specified by a comma-separated list in the environment variable `LOGGING_CATEGORIES`, or if that is not defined `LOGCAT`.

The following logging categories are used, listed roughly in the order in which they are likely to occur:

* `env` -- logs relevant environment variables if they are set.
* `fam` -- logs the FAM (FOLIO application metadata) file that is being used to drive the addition of the app.
* `descriptor` -- logs the module descriptors when they have been downloaded.
* `sorted` -- logs the order of the descriptors after they have been sorted so as to allow the dependencies of each to be met by a predecessor.
* `element` -- logs each elements as it is being handled.
* `end` -- logs the completion of its task. (This is mostly useful in development, to check that asynchronous code has completed.)



