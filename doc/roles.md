# Roles in the creation and use of FOLIO apps

<!-- md2toc -l 2 roles.md -->
* [Introduction](#introduction)
* [The roles](#the-roles)
    * [Module developer](#module-developer)
    * [Module publisher](#module-publisher)
    * [App packager](#app-packager)
    * [App certifier](#app-certifier)
    * [FOLIO administrator](#folio-administrator)
    * [Platform administrator](#platform-administrator)
    * [Tenant admininstrator](#tenant-admininstrator)
    * [User](#user)
* [Discussion](#discussion)
    * [Other roles](#other-roles)
    * [Unopinionated vs. opinionated](#unopinionated-vs-opinionated)
    * [App stores](#app-stores)
    * [Changes in the FAM format](#changes-in-the-fam-format)


## Introduction

In the lifecycle of a FOLIO app, there are many different roles, enumerated below. Many different agents are involved in fulfilling these roles. Some of them may be organizations and others individuals. (In this document, we use "agent" to mean any organization or individual contributing to or using FOLIO.)

Apps in FOLIO are composed of [multiple modules together with some metadata](folio-app-metadata.md). Some of the roles pertain to the modules that make up apps, and some to the apps themselves.

In principle, the roles may all be filled by different agents, but often a single agent will fulfil several of the roles: for example, the developer of a module will often also be its publisher, and a FOLIO administrator may also administrate one or more tenants. Nevertheless, each role is conceptually separate, and it is important not to conflate them so that we make technical decisions reifying (for example) the notion that a certifier of an app must necessarily be its packager.


## The roles


### Module developer

_The agent who creates and maintains a module_. This encompasses both initial development and ongoing maintenance, and both software and documentation. Modules may be for the back-end (to be mediated by Okapi), or the front-end (to be included in a Stripes bundle), or neither (e.g. the FOLIO Z39.50 server, which acts as a WSAPI client to the FOLIO installation).


### Module publisher

_The agent who publishes a module_. This means making available the module descriptor of a specific release or snapshot, together with a Docker container (for back-end modules) or an NPM package (for UI modules) representing the code of that release or snapshot. This can be done manually but is more often performed automatically as part of CI -- by Jenkins, GitHub Actions or similar.

Note that the MAFIA tooling does not care how publication is done (manual, Jenkins, etc.), nor where the published artifacts are placed (Dockerhub or an institutional Docker repository; NPM or an institutional RPM repository; GitHub packages; a simple HTTP service). All that is required is that the artifacts can be addressed by a URL.


### App packager

_The agent who creates an app from its constituent modules_. Doing this entails creating a [FAM file](folio-app-metadata.md) file describing the app, and pushing that FAM file to a publicly visible GitHub project. It is the responsibility of the packager to ensure that the nominated versions of all the modules in the package -- both front-end and back-end -- are mutually compatible.


### App certifier

_An agent who certifies something about an app_. Anyone can create a FAM file, but there is no guarantee about the quality of a give app; it may have a poorly designed UI, it may be incompletely internationalized, it may lack accessibility features, it may even be straight-up malware. To give users of apps reasonable confidence about the software they are using, some trusted entity needs to certify specific properties of the app, such as that it is fully internationalized.

Any number of certifications can be [embedded in a FAM file](folio-app-metadata.md#certification), each of them cryptographically signed so that the certifying agency is known with confidence. Users of apps can then decide which certifications they consider dependable based on which agents they trust.


### FOLIO administrator

_An agent who is responsible for a complete FOLIO installation_, typically running on multiple nodes and with multiple tenants. The FOLIO administrator is responsible for installing and deploying the selected subset of all available apps. This entails running Docker containers for back-end modules and updating the Stripes bundle to include front-end modules.

Different organizations prefer different ways of running FOLIO: some using Kubernetes, some using Docker Swarm, some running a single Okapi that handles deployment as well as proxying. Different tooling will be required for these and other approaches: the challenge will be designing this tooling such that it can be invoked via well-defined APIs in a tachnology-neutral way.


### Platform administrator

_An agent who creates and maintains platforms within an installation_. A platform in this sense is [a selection of apps and modules that work together](platform-and-tenant.md), selected from among those that the FOLIO administrator has made available at the system level. In general an installation will support multiple platforms -- perhaps based on several different flower releases, perhaps corresponding to Debian's stable, testing and unstable distributions.

(Platforms have not yet been fully defined, but will be described in detail in a forthcoming document.)


### Tenant admininstrator

_An agent responsibile for a tenant within an installation_. Each tenant is configured by the selection of one of the platforms furnished by the installation, together with other information such as branding details. Finally, each tenants selects, from the apps provided by its chosen platform, which ones it needs enabled.

(At present, tenants are configured by the `stripes.config.js` file on the client side, and are implicitly defined, one per platform on the server side. This will be made more explicit.)



### User

_An agent who actually uses FOLIO_. The user of the system is presented with a set of apps chosen by the tenant administrator from those provided by the platform selected for that tenant. It would be possible to offer the user the option of selecting a subset of those apps -- librarians with different responsibilities will need different apps and may prefer not to have their screens cluttered with those they do not need. It may also be useful to provide users with a way of browsing apps and submitting installation requests to the relevant adminstrator.



## Discussion


### Other roles

Are there any other roles that I have missed out in this document?


### Unopinionated vs. opinionated

The MAFIA approach to providing and using FOLIO apps is deliberately unopinionated where possible. It does not care:
* Whether roles are filled by the same agent or different agents
* Wherer releases and snapshots are created manually or by a CI tool, or which CI tool is used
* Where release and snapshot artifacts are posted to
* Whether apps use releases or snapshots of the underlying modules
* What agents certify an app, with what certifications
* How back-end modules are deployed (Kubernetes, Docker Swarm, Okapi, etc.)
* XXX Have I missed any other areas of flexibility?

Some opinions, however, have been fixed in code because _some_ decision had to be made. These are:
* The artifacts created for back-end packages are Docker files (rather than, for example, fat JARs)
* FAM files must be published in a public GitHub repository
* XXX Have I missed any other places where a technical decision reifies an opinion?


### App stores

An "app store" UI may be useful at multiple levels to people with different roles:
* The FOLIO administrator can select which apps to download, install and deploy, and tooling can be developed to make this process more straightforward.
* The platform administrator can select which of the installed apps (and at what versions) are to be included in each platform.
* The tenant adminstrator can choose which of the apps in the selected platform are to be included in that tenant's configuration.
* Users can potentially turn on and off the individual apps available to them, and perhaps make requests for apps that are as yet not available.


### Changes in the FAM format

I need to make the following changes to the document and the example file:

* We should include some indication of what "base system" an app claims compatibility with, which is really just which versions of Stripes and Okapi, but in practice will probably be a flower release.


