# CI for Index Data's FOLIO registry

<!-- md2toc -l 2 ci.md -->
* [Context](#context)
* [Requirements](#requirements)
* [Technology](#technology)
* [Specific and general](#specific-and-general)


## Context

Today's Firefly meeting (Tuesday 8 March 2022) was about setting up CI (continuous integration) for FOLIO modules that are destined to be published in Index Data's FOLIO registry rather than the existing monolithic FOLIO registry used by flower releases. The long game is that the approach we end up taking here can be a model for other institutions that want to set up their own FOLIO registries.


## Requirements

We have two requirements for a CI setup:
1. To run unit tests, Jenkins-like, when commits are made to `master`/`main`.
2. To roll releases when tags are pushed to `master`/`main`.

Whatever we come up has to work with both UI and backend modules. Specifically:
* Releasing a UI module means:
  * Publishing an NPM package
  * Generating a module descriptor and pushing it to the registry
* Releasing a backend module means:
  * Publishing a docker container to DockerHub
  * Pushing the module descriptor to the registry

(We are hosting our own FOLIO registry at https://registry.folio-dev.indexdata.com/. We have to option of also hosting our own NPM repository and Docker hub, but there seems little value in doing this when we can just use globally maintained infrastructure.)


## Technology

Traditionally, we have done this kind of thing using [Jenkins](https://www.jenkins.io/). For various reasons we want to move away from Jenkins and towards using [GitHub Actions](https://github.com/features/actions) instead. Since we are now setting up CI for new modules, this seems like a good opportunity to try out the new technology, although we may be in danger of changing two variables at once.

David will take the lead on this since he has the most experience with GitHub actions.


## Specific and general

To make things concrete, for the first phases of this work we will use the modules of the Harvester Admin app:
* [`ui-harvester-admin`](https://github.com/indexdata/ui-harvester-admin) (UI module)
* [`mod-harvester-admin`](https://github.com/indexdata/mod-harvester-admin) (backend module)

Whatever we get working with these two modules should generalize easily enough to other modules. For UI modules, testing is always done with `yarn test` and coverage testing (when supported) by `yarn coverage`. For backend modules, things are potentially more complex: Java-based modules will mostly use `mvn test`, Node-based modules `yarn test`, Perl-based modules `perl Makefile.PL && make test`, etc. Configuration of GitHub Actions to handle this variation should not be too demanding.

At some point, we will need to give thought to the various possible strategies for reducing duplication of GitHub Actions configuration across modules. But at this stage, we want to ignore that further problem, and concentrate on getting a working proof of concept for publishing to an Index Data FOLIO.


