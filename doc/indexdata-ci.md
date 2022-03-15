# Towards a GitHub-based Index Data CI system

<!-- md2toc -l 2 indexdata-ci.md -->
* [Background: why are we doing this?](#background-why-are-we-doing-this)
* [What are we doing?](#what-are-we-doing)
* [Progress to date](#progress-to-date)
* [Open issues](#open-issues)
    * [Which actions do we want to run on which events?](#which-actions-do-we-want-to-run-on-which-events)
    * [When should we build snapshot releases?](#when-should-we-build-snapshot-releases)
    * [Where will we keep the artifacts we build?](#where-will-we-keep-the-artifacts-we-build)


## Background: why are we doing this?

David is currently working on [establishing CI pipelines](ci.md) based on [GitHub Actions](https://github.com/features/actions) for Index Data software: specifically, for the Harvester Admin FOLIO app, consisting of
[`ui-harvester-admin`](https://github.com/indexdata/ui-harvester-admin) (a UI module)
and
[`mod-harvester-admin`](https://github.com/indexdata/mod-harvester-admin) (and backend module).

We have two goals in this work:
1. As a crucial part of [the MAFIA project](../README.md) to establish [an ecosystem for FOLIO modules](ecosystem.md) not dependent entirely on flower releases.
2. As proof of concept for a CI approach that Index Data can use more broadly for its own projects.


## What are we doing?

We are using GitHub Actions to automatically execute certain actions when specific events occur.

There are four lifecycle events potentially of interest in the CI specification of a module (with others also possibly becoming relevant down the line):
* push to a non-main branch
* create a pull request
* push to the main branch (`master` or `main`)
* push a tag to the main branch, indicating a release

And there are at least ten actions that we may wish to have executed in response these events, including:
* Build using Maven (backend)
* Build using NPM (UI)
* Run tests (backend and UI)
* Run Sonar (backend and UI)
* Build Docker container (backend)
* Publish Docker container (backend)
* Generate module descriptor (UI)
* Publish module descriptor (backend and UI)
* Publish Maven artifacts (backend)
* Publish NPM (UI)

**Note.**
Would we ever want to build a Docker container and not publish it? If not, then there is no need to separate the two actions.


## Progress to date

David is tracking his progress so far in a Google Document,
[_DEVOPS-946 CI events and destinations_](https://docs.google.com/document/d/17EVFttL5vYX_RygjfgyrzHy-LnHMM8dCittQ6qJ2Om4/edit#heading=h.bqvo4e9g2eur).

David's document shows matrices of events that can occur (the columns) against the actions that happen in response. (In fact, these matrices are effectively three-dimensional since each column heading appears twice: once for what FOLIO presently does, and once for what we want our own CI to do.)


## Open issues

### Which actions do we want to run on which events?

The matrices in David's document convey two quite separate, but easily conflated kinds of information: what mechanism is provided; and what policy we want to use that mechanism to implement. His work will make it _possible_ for us to run any combination of actions on any event, but we will need to figure out what actions we actually want. We have the example of FOLIO's CI workflows to guide us, but we don't want to follow these blindly.

In particular, one such question is contentious:

### When should we build snapshot releases?

In FOLIO CI, every push to the main branch generates a snapshot build, which is potentially expensive in several respects: resources needed to make the build, space needed to keep it around, cognitive burden of multiple builds. We are not constrained to emulate this policy.

John would prefer that snapshot builds are created only when explicitly requested, for example by pushing a tag in a recognised format. Jakub thinks it's important that there is a build for each push and wants to retain the FOLIO approach. There are requirements here that still need to be laid out and analysed. Jakub could helpfully take the lead in drafting a document that lays out what he perceives to be the requirements.

A compromise solution would at least skip the pull-request-test-merge-build-release dance for "simple commits". What would that mean exactly? The concept can be debated -- for example, editing only a comment in a source-code file need not fire up all this mechanism, but detecting such commits may not be easy. Perhaps the simplest approach would be to skip action when all the commits in a push relate only to files whose names end with `.md` or `.txt` -- on other words, documentation.


### Where will we keep the artifacts we build?

[GitHub Packages](https://github.com/features/packages) is an artifact repository that we could use in place of DockerHub, the standard NPM repository, or both. John thinks this would be a win because of the GitHub integration.

My only concern is how you would configure NPM, Yarn and other related tooling, to be able to pull packages from GitHub Packages _as well as_ the standard place.


