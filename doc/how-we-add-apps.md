# How we add apps to FOLIO

<!-- md2toc -l 2 how-we-add-apps.md -->
* [Introduction](#introduction)
* [Steps to add an app](#steps-to-add-an-app)
    * [1. Registering the module](#1-registering-the-module)
    * [2. Deploying the module](#2-deploying-the-module)
    * [3. Discovery for the module](#3-discovery-for-the-module)
    * [4. Enabling the module for the tenant](#4-enabling-the-module-for-the-tenant)
* [The big question: what actually is a FOLIO module?](#the-big-question-what-actually-is-a-folio-module)
* [Appendix A. Multi-node arrangements](#appendix-a-multi-node-arrangements)
* [Appendix B. UI modules](#appendix-b-ui-modules)



## Introduction

Before we can properly understand [what we mean by an "app" in FOLIO](what-is-an-app.md), or design [a package format](package.md), we need to understand the current bit-by-bit process of adding an app to a running FOLIO tenant. Only then can we properly pick apart which parts of the process are genuinely to do with the app itself (and thereore in principle packagable) and which are to do with a particular deployment strategy (in which case they must be left for different operators to do in the way that seems best to them).

This description of how things are presently done is largely derived from a meeting with Wayne Schneider on 14 December 2021, and in places may reflect how Index Data does deployment rather than fundamental facts about FOLIO.

We will use the example of Course Reserves, a simple app consisting only of one UI module and one back-end module, and hope that this generalises well to more complex apps with multiple modules.

Assuming the relevant artifacts are to hand, getting a new module running for a tenant involves four steps: registering it with Okapi, deploying it, making it available to discovery, and enabling it for the tenant.



## Steps to add an app


### 1. Registering the module

The following artifacts are needed:
* Container image for the back-end module
* Module descriptor for the back-end module
* NPM package for the front-end module

(The module descriptor for a UI module is generated from `package.json` How can we similarly get the back-end module descriptor out of the container? There are implicit conventions but no actual specifications. If we define a metadata format for containers specifying things like how to extract the module descriptor, we would want it to be fully general so it does not depend on Java, on frameworks, or even on the use of JSON over HTTP.)

Both module descriptors are registered with Okapi by posting to `/_/proxy/modules`.

Part of the concrete implementation of a [platform](cluster-architecture.md#platforms) could be an Okapi repository for the relevant modules.


### 2. Deploying the module

In this case, we deploy the module (in this case `mod-courses`), typically by somehow starting its Docker container in a location where Okapi can reach it. There are several ways to do this:
* Okapi can deploy it (directly using `/_/deployment` or indirectly using `/_/discovery`) but this is rarely done in production.
* A Kubernetes pod can spin up the container.
* You could just start it from the command-line.

There is often information necessary for deployment that is buried in the deployment section of the module descriptor. Apparently this can include things like which of the port numbers the module uses is the one that should be exposed to Okapi. This information was originally intended to be used by Okapi when it is doing deployment, but we also parse this out and use it to configure how we deploy using Kubernetes. But most of this information is (rightly) overridden or modified by information stored elsewhere as part of the orchestration system.


### 3. Discovery for the module

Discovery in this context means telling Okapi where your module is. This is done by posting to `/_/discovery`.

Some people in the FOLIO community would prefer to have Okapi use Kubernetes' own discovery service. But this seems wrong because Okapi should not be Kubernetes-focussed but orchestration-neutral.


### 4. Enabling the module for the tenant

At the low level, this can be done by posting to `/_/proxy/tenants/TENANT/modules` (as the supertenant) or to `/_/tenant` with an `X-Okapi-Tenant` header specifying which tenant to act as.

But more typically, it is done using [the higher-level "install" operation](https://github.com/folio-org/okapi/blob/master/doc/guide.md#install-modules-per-tenant), posting a set of modules all together to `/_/proxy/tenants/TENANT/install`. This operation is able to resolve dependencies within the added set, avoiding ordering constraints such as the need to enable (for example) `mod-inventory-storage` before `mod-inventory`. It will also enable any other modules already known to it that are required to satisfy the dependencies of those posted.

**XXX Note.** We should probably be using the `install` endpoint in the Okapi Console, instead of the simpler operation currently used.

If the query parameter `simulate=true` is passed to `/install`, then no modules are enabled, but Okapi returns a list of the modules that _would_ be enabled.

**XXX Note.** We should have a way to do this from the Okapi Console.

Typically, the install operation will perform only enable operations, but if we pass the undocumented `deploy=true` option, Okapi will also try to deploy modules to satisfy requirements. This may be useful for development setups but is of no use when we are using Kubernetes or an alternative for orchestration in a production system.



## The big question: what actually is a FOLIO module?

The relevance of all of this to the MAFIA initiative is this: which parts of this process are functions of the module being installed, and which are functions of the environment it's being installed into?

Whatever a packaged FOLIO app looks like, we will need it to capture all of the former aspects, but to omit all the latter. For example, a packaged app cannot contain anything specific to Kubernetes, because that package may be installed on an environment that does not use Kubernetes.

Disentangling these two aspects is more difficult than it might otherwise be due to some level of confusion in existing arrangements: for example, the module descriptor, which is meant to be a statement of the module's capabilities, can include a deployment descriptor. This seems conceptually wrong.



## Appendix A. Multi-node arrangements

For the sake of simplicity, we did not think about multi-node arrangements in yesterday's meeting. In the general case of [an Okapi cluster of _n_ nodes](https://github.com/folio-org/okapi/blob/master/doc/guide.md#running-in-cluster-mode):
* We register the module once, with any of the nodes.Presumably we deploy it * * We deploy the module some number of times -- quite possibly_n_, but potentially fewer (if it's not running on all the nodes) or even more (since a multiple instances of a module can run on a single node).
* We send discovery information _m_ times (once for each deployed process)?
* We enable the module for the tenant only once.

**XXX Note.** I do not yet know how much of this is correct. Wayne, please comment!



## Appendix B. UI modules

We will need to think a bit more about how and when a Stripes bundle is rebuilt to include an added module.



