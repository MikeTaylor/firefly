# add-app-to-platform

<!-- md2toc -l 2 README.md -->
* [Overview](#overview)
* [Invocation](#invocation)
* [Okapi access](#okapi-access)
* [Logging](#logging)
* [Deployment plugins](#deployment-plugins)
    * [`async deploy(logger, element)`](#async-deploylogger-element)


## Overview

[`add-app-to-platform.js`](add-app-to-platform.js) is an attempt to capture the manual steps of adding an app to a platform in code -- at this stage, not so much in the hope that it will be useful, more in an attempt to find out where the gaps are. It is driven by a single FAM file, which may be obtained via the WSAPI provided by [`mod-app-manager`](https://github.com/MikeTaylor/mod-app-manager) or by any other method.

While posting module descriptors to Okapi is always required, the details of how to deploy a module vary, and different organizations use different orchestration mechanisms. This step is therefore done using a plugin (see [below](#deployment-plugins)). The `okapi` plugin uses Okapi's built-in simple deployment mechanisms; others will be added, including `kubernetes`.


## Invocation

`add-app-to-platform` is invoked using `babel-node` to interpret ES6 features in JavaScript. The only command-line argument is the name of a [FAM (FOLIO Application Metadata) file](../../doc/folio-app-metadata.md). Use something like:

	babel-node --presets=env add-app-to-platform/add-app-to-platform.js ../examples/harvester-admin.fam

The following command-line options are supported:

* `-D` or `--deployment=STRING` -- Use deployment plugin (default: okapi)
* `-V` or `--version` -- Display the version number and exit
* `-h` or `--help` -- Display a full list of options


## Okapi access

`add-app-to-platform` posts module descriptors to Okapi's proxy service. It uses environment variables to control its access to Okapi (URL, tenant, token or user/password) in exactly the same way as [`okapi-curl-env`](https://github.com/folio-org/folio-tools/tree/master/okapi-curl-env) -- in what we can hope will become a standard for command-line tools. In short:

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
* `http` -- logs each successfully completed HTTP/HTTPS operation, e.g. posting module descriptor.
* `plugin` -- logs plugin-dependent deployment processes.
* `deploy` -- logs messages about the outcome of deployment processes.
* `end` -- logs the completion of all tasks, noting how many elements of the FAM were handled. (This is mostly useful in development, to check that asynchronous code has completed.)


## Deployment plugins

Deployment plugins are found in [the `deployment` subdirectory](deployment). Each plugin must export the following functions (currently only one):

### `async deploy(logger, element)`

This is an asynchronous function that performs deployment according to the approaching orchestration scheme. It is passed two arguments
* `logger` is the configured logger element (and is expected to use it to log with the `plugin` category).
* `element` represents the module to be deployed. This is one of the elements from the FAM file, representing a back-end module, enhanced by the addition of two extra members:
  * `md` is the downloaded module descriptor.
  * `caption` is a short human-readable caption representing the module, to be used in logging.

The `deploy` function must return (a promise yielding) an opaque identifier representing the deployed module, or throw an `Error` if something goes wrong.

The function may access additional information from the environment: for example, the `okapi` plugin uses the environment variables documented [above](#okapi-access) (`OKAPI_URL`, `OKAPI_TENANT`, `OKAPI_TOKEN`) that are also used in posting the module descriptor.


