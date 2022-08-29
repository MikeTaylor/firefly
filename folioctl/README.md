# `folioctl` -- command-line administration for FOLIO

<!-- md2toc -l 2 README.md -->
* [Overview](#overview)
* [What's here?](#whats-here)
* [Invocation](#invocation)
* [Okapi access](#okapi-access)
* [Logging](#logging)
* [Command API](#command-api)
* [See also](#see-also)


## Overview

This directory contains a command-line tool, `folioctl`, that provides practical support for the Firefly concepts. It is invoked with one of several supported subcommand, in the spirit of commands like `apachectl` and `kubectl`, which are invoked like `apachectl start` and `apachectl graceful`. Each command is implemented in its own subdirectory, and may rely on shared utilities in the `util` directory.


## What's here?

* [`package.json`](package.json) describes `folioctl` for packaging, and specifies dependencies
* [`folioctl.js`](folioctl.js) is the main function which invokes specific commands
* [`util`](util) contains shared utility code
* [`version`](version),
[`add-app`](add-app)
implement the similiarly named commands. See separate README.md files in these directories.


## Invocation

`folioctl` is invoked using `babel-node` to interpret ES6 features in JavaScript. If used to add an app (the `add-app` command), the only additional command-line argument is the name of a [FAM (FOLIO Application Metadata) file](../doc/folio-app-metadata.md). Use something like:

	babel-node --presets=env folioctl.js ../examples/harvester-admin.fam

The following command-line options are supported:

* `-D` or `--deployment=STRING` -- Use add-app deployment plugin (default: okapi)
* `-h` or `--help` -- Display a full list of options


## Okapi access

Some (not all) commands need to access an Okapi instance -- for example, `add-app` posts module descriptors to Okapi's proxy service. `folioctl` uses environment variables to control its access to Okapi (URL, tenant, token or user/password) in exactly the same way as [`okapi-curl-env`](https://github.com/folio-org/folio-tools/tree/master/okapi-curl-env) -- in what we can hope will become a standard for command-line tools. In short:

* `OKAPI_URL` (required): the base URL of the Okapi gateway
* `OKAPI_TENANT` (default `supertenant`): The tenant ID of the tenant of the Okapi service
* `OKAPI_TOKEN`: An authtoken for Okapi authorization

(Note that we do _not_ presently support `OKAPI_USER` and `OKAPI_PW` as an alternative to `OKAPI_TOKEN`.)

When invoked with a command that needs Okapi access, `folioctl` will refuse to run if these environment variables are not defined.


## Logging

`folioctl` uses [`categorical-logger`](https://github.com/openlibraryenvironment/categorical-logger) for logging. It logs messages in the categories specified by a comma-separated list in the environment variable `LOGGING_CATEGORIES`, or if that is not defined `LOGCAT`.

The following logging categories are used, listed roughly in the order in which they are likely to occur (many of them by specific commands rather than by the top-level `folioctl` script):

* `env` -- logs relevant environment variables if they are set.
* `fam` -- logs the FAM (FOLIO application metadata) file that is being used to drive the addition of the app.
* `descriptors` -- logs all the the elements as enhanced by downloaded module descriptors.
* `sorted` -- logs the order of the descriptors after they have been sorted so as to allow the dependencies of each to be met by a predecessor.
* `element` -- logs each elements as it is being handled.
* `http` -- logs each successfully completed HTTP/HTTPS operation, e.g. posting module descriptor.
* `plugin` -- logs plugin-dependent deployment processes.
* `deploy` -- logs messages about the outcome of deployment processes.
* `end` -- logs the completion of all tasks, noting how many elements of the FAM were handled. (This is mostly useful in development, to check that asynchronous code has completed.)



## Command API

XXX to do


## See also

* [The Firefly initiative](https://github.com/MikeTaylor/firefly), of which this work is a part.
* [`mod-app-manager`](https://github.com/MikeTaylor/mod-app-manager), a FOLIO module for discovering available applications.


