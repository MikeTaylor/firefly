# add-app-to-platform

<!-- md2toc -l 2 README.md -->
* [Overview](#overview)
* [Logging](#logging)


## Overview

[`add-app-to-platform.js`](add-app-to-platform.js) is an attempt to capture the manual steps of adding an app to a platform in code -- at this stage, not so much in the hope that it will be useful, more in an attempt to find out where the gaps are. It is driven by a single FAM file, which may be obtained via the WSAPI provided by [`mod-app-manager`](https://github.com/MikeTaylor/mod-app-manager) or by any other method.

While posting module descriptors to Okapi is always required, the details of how to deploy a module vary, and different organizations use different orchestration mechanisms. This step is therefore done using a plugin (API documentation to follow). The `okapi` plugin uses Okapi's built-in simple deployment mechanisms; others will be added, including `kubernetes`.


## Invocation

`add-app-to-platform` is invoked using `babel-node` to interpret ES6 features in JavaScript. The only command-line argument is the name of a [FAM (FOLIO Application Metadata) file](../../doc/folio-app-metadata.md). Use something like:

	babel-node --presets=env add-app-to-platform/add-app-to-platform.js ../examples/harvester-admin.fam

The following command-line options are supported:

* `-o` or `--orchestration=STRING` -- Use orchestration plugin (default: okapi)
* `-V` or `--version` -- Display the version number and exit
* `-h` or `--help` -- Display a full list of options


## Okapi access

`add-app-to-platform` uses environment variables to control its access to Okapi (URL, tenant, token or user/password) in exactly the same way as [`okapi-curl-env`](https://github.com/folio-org/folio-tools/tree/master/okapi-curl-env) -- in what we can hope will become a standard for command-line tools. In short:

* `OKAPI_URL` (required): the base URL of the Okapi gateway
* `OKAPI_TENANT` (default `supertenant`): The tenant ID of the tenant of the Okapi service
* `OKAPI_TOKEN`: An authtoken for Okapi authorization

(Note that we do _not_ presently support `OKAPI_USER` and `OKAPI_PW` as an alternative to `OKAPI_TOKEN`.)


## Logging

`add-app-to-platform` uses [`categorical-logger`](https://github.com/openlibraryenvironment/categorical-logger) for logging. It logs messages in the categories specified by a comma-separated list in the environment variable `LOGGING_CATEGORIES`, or if that is not defined `LOGCAT`.

The following logging categories are used, listed roughly in the order in which they are likely to occur:

* `env` -- logs relevant environment variables if they are set.
* `fam` -- logs the FAM (FOLIO application metadata) file that is being used to drive the addition of the app.
* `descriptors` -- logs all the the elements as enhanced by downloaded module descriptors.
* `sorted` -- logs the order of the descriptors after they have been sorted so as to allow the dependencies of each to be met by a predecessor.
* `element` -- logs each elements as it is being handled.
* `post` -- logs each successfully posted module descriptor.
* `end` -- logs the completion of all tasks, noting how many elements of the FAM were handled. (This is mostly useful in development, to check that asynchronous code has completed.)



