# FOLIO app metadata in module descriptors

<!-- md2toc -l 2 folio-app-module-descriptor.md -->
* [Introduction](#introduction)
* [Advantages](#advantages)
* [Disadvantages](#disadvantages)
* [Extensions required to the module-descriptor format](#extensions-required-to-the-module-descriptor-format)


## Introduction

The proposed [FOLIO App Metadata (FAM) file format](folio-app-metadata.md) was generally well received by the MAFIA working group, but one important question was raised: do we need a new format at all, or can we just extend the existing [module descriptor format](https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json)?

If we take this approach then, as well as being used to inform Okapi of machine-readable properties of modules, these descriptors will also be used by the App Store to advertise high-level modules (i.e. "apps") to human users.

If this approach is to work well, we need to ensure that the format is general enough to handle:
* Both UI and backend modules
* Artifacts from various different places, e.g. GitHub Packages, DockerHub, global NPM registry, FOLIO NPM registry
* Different approaches to deployment, e.g. Kubernetes vs Amazon ECS vs Docker Swarm

As always, we must remember the fine motto of the X windows system:
**Mechanism, not policy**.


## Advantages

This approach is appealing for several reasons.

First and most obviously, it avoids multiplying entities. Okapi already has module descriptors, deployment descriptors, tenant association descriptors and (embedded in a module or deployment descriptor) launch descriptors. Adding yet a fifth descriptor for apps might seem excessive. (Alternatively, it could be argued that when there are aready four kinds of descriptor, what's one more?)

* By expressing an app as a "virtual module", it provides the possibility of recursive dependencies.


## Disadvantages

XXX requires changes to an existing format

XXX may dilute/expand existing purpose of descriptor

XXX requires community to accept changes to the existing format


## Extensions required to the module-descriptor format

A way to either depend on an implementation, or make a user choose one

[The existing launch descriptor](https://github.com/folio-org/mod-users/blob/fa523ff0fbc4076f11e863c88149dfed0e7c0dd7/descriptors/ModuleDescriptor-template.json#L493-L515) that can be embedded in a module descriptor may already contain all necessary artifact-location information for backend modules; is that true for UI modules?

It may be useful to also link to [the human-readable page about a GitHub Packages release](https://github.com/indexdata/mod-harvester-admin/pkgs/container/mod-harvester-admin?tag=v0.1.0-SNAPSHOT.7).


