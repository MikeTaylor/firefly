# How we add apps to FOLIO

<!-- md2toc -l 2 how-we-add-apps.md -->
* [Introduction](#introduction)
    * [Multi-node arrangements](#multi-node-arrangements)
* [Registering the module](#registering-the-module)
* [Deploying the module](#deploying-the-module)
* [Discovery for the module](#discovery-for-the-module)
* [Enabling the module for the tenant](#enabling-the-module-for-the-tenant)


## Introduction

Before we can properly understand [what we mean by an "app" in FOLIO](what-is-an-app.md), or design [a package format](package.md), we need to understand the current bit-by-bit process of adding an app to a running FOLIO tenant. Only then can we properly pick apart which parts of the process are genuinely to do with the app itself (and thereore in principle packagable) and which are to do with a particular deployment strategy (in which case they must be left for different operators to do in the way that seems best to them).

This description of how things are presently done is largely derived from a meeting with Wayne Schneider on 14 December 2021, and in places may reflect how Index Data does deployment rather than fundamental facts about FOLIO.

We will use the example of Course Reserves, a simple app consisting only of one UI module and one back-end module, and hope that this generalises well to more complex apps with multiple modules.

Assuming the relevant artifacts are to hand, getting a new module running for a tenant involves four steps: registering it with Okapi, deploying it, making it available to discovery, and enabling it for the tenant.


### Multi-node arrangements

For the sake of simplicity, we did not think about multi-node arrangements in yesterday's meeting. In the general case of an Okapi cluster of _n_ nodes, do we register the module one time or _n_ times? Presumably we deploy it _n_ times, or maybe _m_ times for some other number _m_ of worker nodes? And I guess we send discovery information _m_ times (once for each deployed process)? But we only enable the module for the tenant once. XXX I do not yet know if this is correct.


## Registering the module

Artifacts needed:
* Container image for back-end module
* Module descriptor for back-end module
* NPM package for front-end

(The module descriptor for a UI module is generated from `package.json` How can we similarly get the back-end module descriptor out of the container? There are implicit conventions but no actual specifications. If we define a metadata format for containers specifying things like how to extract the module descriptor, we would want it to be fully general so it does not depend on Java, on frameworks, or even on the use of JSON over HTTP.)

Both module descriptors are registered with Okapi.

Part of a platform could be an Okapi repository for the relevant modules.


## Deploying the module

In this case, we deploy the module (in this case `mod-courses`), typically by somehow starting its Docker container in a location where Okapi can reach it. There are several ways to do this:
* Okapi can deploy it, but this is rarely done in production
* A Kubernetes pod can spin up the container
* You could just start it from the command-line

There is often information necessary for deployment that is buried in the deployment section of the module descriptor. Apparently this can include things like which of the port numbers the module uses is the one that should be exposed to Okapi. This information was originally intended to be used by Okapi when it is doing deployment, but we also parse this out and use it to configure how we deploy using Kubernetes. But most of this information is (rightly) overridden or modified by information stored elsewhere as part of the orchestration system.


## Discovery for the module

Discovery in this context means telling Okapi where your module is.

Some people in the FOLIO community would prefer to have Okapi use Kubernetes' own discovery service. But this seems wrong because Okapi should not be Kubernetes-focussed but orchestration-neutral.


## Enabling the module for the tenant

We can use `simulate=true` to have Okapi tell us what it would do if we enabled the module, by way of enabling other modules.

**XXX Note.** We should have a way to do this from the Okapi Console.

**XXX Note.** We should probably be using the `install` endpoint as documented in the Okapi Guide.

Generally this will only do enable operations to make it possible for the current module to be enabled, but if we pass `deploy=true` Okapi will also try to deploy modules to satisfy requirements. But this is of no use when we are using Kubernetes for orchestration.



