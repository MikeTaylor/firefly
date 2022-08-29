# `folioctl` -- command-line administration for FOLIO

<!-- md2toc -l 2 README.md -->
* [Overview](#overview)
* [What's here?](#whats-here)
* [See also](#see-also)


## Overview

This directory contains a command-line tool, `folioctl`, that provides practical support for the Firefly concepts. It is invoked with one of several supported subcommand, in the spirit of commands like `apachectl` and `kubectl`, which are invoked like `apachectl start` and `apachectl graceful`.



## What's here?

* [`package.json`](package.json) describes `folioctl` for packaging, and specifies dependencies
* [`folioctl.js`](folioctl.js) is the main function which invokes specific commands
* [`util`](util) contains shared utility code
* [`version`](version),
[`add-app`](add-app)
implement the similiarly named commands. See separate README.md files in these directories.

## See also

* [The Firefly initiative](https://github.com/MikeTaylor/firefly), of which this work is a part.
* [`mod-app-manager`](https://github.com/MikeTaylor/mod-app-manager), a FOLIO module for discovering available applications.


