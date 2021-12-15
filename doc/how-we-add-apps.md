# How we add apps to FOLIO

<!-- md2toc -l 2 how-we-add-apps.md -->
* [Introduction](#introduction)
* [Registering the module](#registering-the-module)
* [Deploying the module](#deploying-the-module)
* [Discovery for the module](#discovery-for-the-module)
* [Enabling the module for the tenant](#enabling-the-module-for-the-tenant)


## Introduction

Current state (from Wayne)

Let's use the example of a simple app like Course Reserves.


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



