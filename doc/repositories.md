# Where to keep CI build artifacts of FOLIO modules

<!-- md2toc -l 2 repositories.md -->
* [Background](#background)
* [Criteria](#criteria)
* [Candidate solutions](#candidate-solutions)
* [The grand unified theory](#the-grand-unified-theory)
* [What are going to actually do](#what-are-going-to-actually-do)


## Background

As part of the process of [enabling FOLIO to be as modular in practice as it is in principle](../README.md), we are [setting up CI pipelines based on GitHub Actions](indexdata-ci.md) for non-flower-release modules. The intention is to make them available for FOLIO installations to install, much as creators of Unix packages make them available. We are testing these ideas on the Harvester Admin app, which consists of
a backend part ([`mod-harvester-admin`](https://github.com/indexdata/mod-harvester-admin))
and
a UI part ([`ui-harvester-admin`](https://github.com/indexdata/ui-harvester-admin)).

One important decision is what do with the artifacts that are created by these CI workflows. Three kinds of artifacts are generated:
* FOLIO module descriptors, for both backend and UI modules
* Docker images, for backend modules
* NPM packages, for UI modules

For both kinds of modules, we plan to post the descriptors to [the Index Data registry](https://registry.folio-dev.indexdata.com/), but we have yet to decide where are the best places to put Docker images and NPM packages.


## Criteria

Our goal is that _many_ organizations should take up the approach we pioneer, giving rise to a robust, competitive ecosystem. In light of that, we have several criteria, some conflicting, for the choice of artifact repositories.

1. Users of modules should to be able to obtain them with minimum difficulty.
2. Providers of modules should be able to make them available with as little friction as possible.
3. Modules should be consistently available.
4. There should be no single point of failure.


## Candidate solutions

We are using the Index Data registry for module descriptors: that's a decision, and it's been implemented. (After all, there is no other registry out there _to_ use at the moment, apart from the flower-release one, and the purpose of this exercise is break the dependency on flower releases.)

That leaves the choices of Docker image and NPM package repositories. For both, the conflict is the same: maximum convenience is afforded by using the monolithic repositories maintained by the organizations in question ([DockerHub](https://hub.docker.com/) and ([the NPM repository](https://www.npmjs.com/) respectively), but using these takes us back to a centralization that we want to avoid. In additional, DockerHub's recent pivot to throttling bandwidth unless a fee is paid is both practically inconvenient and ethically noxious.

One alternative is to use [GitHub Packages](https://github.com/features/packages) for one or both of Docker images and NPM packages. This neatly keeps the released artifacts alongside the source code that generated them, but involves additional work on the developing organization to set up the repositories.

Organizations can also host their own Docker image repository, NPM package repository or both if they want to avoid dependence on third parties and their downtimes. That said, it's likely that Docker, NPM and GitHub have more experience with and infratructure for high availability than most FOLIO developer organizations.


## The grand unified theory

The principle that we want to underlie our decision-making here is that _it doesn't matter_ where an organization chooses to put its CI artifacts, so long as it's able to advertise their locations. It has to be fine (for example) for Index Data to use GitHub Packages for its Docker images and the central NPM repository for its NPM packages, while Company X use Dockerhub and a locally hosted NPM repository. Company X is likely to run its own module-descriptor registry rather than posting to Index Data's (although that is a possibility), so setting up a little more infrastructure may not feel like too much of a burden.

We did not discuss this in today's meeting (10 May 2022), but perhaps one missing piece of the jigsaw is a simple "FOLIO module" metadata file, containing links to the module descriptor and Docker image or NPM package that make up the module. Or perhaps, a little more ambitiously, a simple "FOLIO module" metadata file, containing links to the backend and UI module descriptors, Docker image and NPM package that make up the whole app. (For more ambitious and nebulous ideas along these lines, see [_Thoughts on the MAFIA package format_](package.md).)


## What are going to actually do

The Harvester Admin app has at least three roles:
1. We need to actually deliver it to the customer, using working mechanisms.
2. We want it to prove those mechanisms to us, in all their generality.
3. It will serve as an examplar, both for our own future work and for other FOLIO developer organizations.

For other developer organizations, maybe the most important consideration is that we want to show the simplest possible route to publishing FOLIO application; once they have implemented that, hopefully easily, they can always go on from there to use a different approach that better suits their requirements.

So in the name of simplicity, our inclination is:
* We want to publish Docker images to DockerHub.
* We want to publish NPM package to the central NPM repository.

However, since we already have GitHub actions written for `mod-harvester-admin` that publish the Docker image to GitHub Packages, there is not enough value in changing this working workflow. So we will leave it as it is, and add GitHub actions to `ui-harvester-admin` that publish to the central NPM repository.

We can always change this later.


