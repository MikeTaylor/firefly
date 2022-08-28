# Platforms and tenants

Notes from meeting of 2022-06-28


<!-- md2toc -l 2 platform-and-tenant.md -->
* [Current status](#current-status)
* [A FOLIO package-file format, redux](#a-folio-package-file-format-redux)
* [Platforms, redux](#platforms-redux)
* [Changes to deployment patterns](#changes-to-deployment-patterns)


## Current status

Where we are as of 28 June 2022:

* David has created GitHub Actions workflows for the backend module (some time ago), but needs Mike to test them.
* We said in the meeting that we need David to make GitHub actions workflows for the UI module, but [a comment on DEVOPS-946](https://jira.indexdata.com/browse/DEVOPS-946?focusedCommentId=1841464&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-1841464) says that there is now a "build-npm" workflow at ui-harvester-admin -- and indeed [there is](https://github.com/indexdata/ui-harvester-admin/actions/workflows/build-npm.yml).
* What we do still lack is a workflow for actually making a release of a UI module.
* We need to be clear in our minds whether we want snapshots as well as releases. As we recall, John Malconian had a concrete reason for needing a snapshot of `mod-harvester-admin` when setting up the Harvester demo system, but the reasons are no longer clear.
* Docker containers for `mod-harvester-admin` snapshots are found [in GitHub Packages](https://github.com/indexdata/mod-harvester-admin/pkgs/container/mod-harvester-admin) and module descriptors in [the Index Data FOLIO Registry](https://registry.folio-dev.indexdata.com/_/proxy/modules).

We really want to get a complete Firefly-based system working before WOLFCon, so that Mike's presentation [FOLIO modularity in practice: seamless deployment of modules from multiple sources](https://wolfcon2022.sched.com/event/14ANV/folio-modularity-in-practice-seamless-deployment-of-modules-from-multiple-sources?linkback=grid) can be about what we _are_ doing rather than what we _plan_ to do.


## A FOLIO package-file format, redux

We have written extensively about a [FOLIO package-file format](package.md), but we are now at the point where we really need to define a format to point at all components of an app: UI MD, UI node package, backend MD, backend Docker container, etc.

Most immediately, we have a concrete need to describe the location of the `mod-harvester-admin` app, which now actually exists as described above.


## Platforms, redux

We should firm up the administrative notion of ["platforms"](cluster-architecture.md#platforms): sets of modules in particular versions which have been tested together and and known with reasonable confidence to work together.
* Although Okapi can support multiple versions of the same modules, a platform should will offer only one version each module.
* A single system may support multiple platforms.
* Each tenant on a system would use one of that system's supported platform, and could upgrade from an older to a newer.
* Tenants that are on the same platform will choose from among that platform's set of modules: different tenants may choose different subsets, but cannot choose different versions of any module.

So far, no thought at all has been given to how platforms might be implemented. Would they be represented by some kind of configuration file? Would some piece of software enforce a tenant's choice of some one of the available platforms? How would that choice be persisted? There is much work to do here.


## Changes to deployment patterns

To do deployment right, we need to start thinking more clearly about what is confgured for the system and what for each tenant. At present these lines are blurred: for example, `platform_complete` has `install-extras.json` which describes what modules should be proxied by the FOLIO system, and `install.json` (which is generated from this and other sources) which is used to enabled modules for _all_ tenants. We need to disentangle these, and we will likely also want to think about platforms.

Once we have a FOLIO Package format, a list of such files would (conceptually) be a replacement for `install-extras.json`. That suggests we need not only a package format, but a list-of-packages format.

Even assuming this works out, we would still need to think about what kind of file would specify a platform, and a tenant. Presumably there will be a platform descriptor, which specifies all available modules within the platform (from among those provided by the system) and the specific versions. And each tenant descriptor -- rather like an extended version of the present `stripes.config.js` -- would contain a pointer to the relevant platform together with the selection of which of the the platform's modules is to be included, and a few other bits and pieces. We would hope at some point to be able to maintain tenant configs not as static files but in the app-store.

The missing piece to implement platforms is a script to read a tenant config, find the associated platform and, thus informed, enable the appropriate modules for the tenant in Okapi.


