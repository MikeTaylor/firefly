# Representing platforms with FAM files

<!-- md2toc -l 2 fam-files-for-platforms.md -->
* [Background](#background)
* [The present situation](#the-present-situation)
* [The MAFIA proposal](#the-mafia-proposal)


## Background

In the conception of a complete FOLIO installation that has evolved from the MAFIA discussions, a fairly complex multi-level structure has arisen, largely reflecting the reality of how our present ad-hoc structure are structured:
* A FOLIO installaton supports multiple platforms
* A FOLIO installation also hosts several tenants
* Each tenant uses one of the available platforms, and selects a subset of the specific apps to include from the superset provided by the chosen platform
* Each platform contains multiple apps and modules
* Each app contains multiple modules

This means that in principle we need file formats, describing:
* installations
* platforms
* tenants
* apps, and
* modules.

Does this mean we need five different file formats?


## The present situation

At present there is no declarative form for describing an **installation**.

**Platforms** are represented by branches of git repositories: for example, the platforms used by the University of Chicago for testing, staging and the live system might be represented by `testing`, `staging` and `live` branches in a `folio-config-uchicago` repository. Each branch of such a respository contains multiple relevant files including `package.json` specifying which Stripes modules are included in the UI bundle, and `install-extras.json` specifying which back-end modules are to be included. Both these files indicate specific versions of particular modules -- in contrast to module descriptors (see below) which indicates what interfaces are required, but leave it to other parts of the process to determine what modules, at what versions, will fulfil those requirements.

**Tenants** are described by a `stripes.config.js` file which selects a subset of the available modules and specifies a few other bits and pieces such as branding. At present, these files live in the same git repositories as the platform definitions, which is an unfortunate conflation.

**Apps** are not represented at all in current FOLIO systems, and are implied on an ad-hoc basis by the inclusison of relevant sets of modules.

**Modules** are of course specified by their module descriptors.

One key observation here is that the platform -- not the tenant, nor individual modules -- is responsible for decision which specific modules are to be provisioned, and which versions of those modules. The tenant is able to choose from among the provided modules. This distinction is rather elided at present due to the platform's and the tenant's files cohabiting, but in principle it is a clear separation of concerns.



## The MAFIA proposal

We do not currently propose to introduce a declarative form for describing **installations**, as too many details are dependent on the orchestration software used.



XXX



