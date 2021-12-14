# What actually is a FOLIO app?

<!-- md2toc -l 2 what-is-an-app.md -->
* [Introduction](#introduction)
* [Software Components](#software-components)
    * [UI modules](#ui-modules)
    * [Back-end modules](#back-end-modules)
    * [Others](#others)
* [Procedures](#procedures)
    * [UI installation](#ui-installation)
    * [Back-end installation](#back-end-installation)
    * [Other installation](#other-installation)
    * [Deployment](#deployment)
* [Conclusion](#conclusion)



## Introduction

On some rough level, we all know what we mean when we talk about an "app" in FOLIO. It's a thing like Course Reserves that has a UI component ([`ui-courses`](https://github.com/folio-org/ui-courses)) and a server-side component ([`mod-courses`](https://github.com/folio-org/mod-courses)) which can be installed together, given appropriate devops wizardry, to provide a user-facing application that adds a coherent piece of functionality to a FOLIO installation -- in this case, the ability to manage courses and reserve items to them.

But this description handwaves away a lot of complexity, not least in the "devops wizardry". Until we can lay out what steps are required to install a FOLIO app, we can't really say we know what an app _is_. And when the wizardly is complex and time-consuming, we may not really have a boundaried notion of what we mean by an app at all.

One of the goals of [the MAFIA project](https://github.com/MikeTaylor/mafia) is to make it simple to add an app to an existing FOLIO installation. To do this we need to be able to state clearly what are the things that make up the app, and what steps need to be performed in order to add and enable the app. This document aims to enumerate these things so we can start thinking in a more informed way about [what it would take to package them](package.md).



## Current state (from Wayne)

Let's use the example of a simple app like Course Reserves.


### Registering the module

Artifacts needed:
* Container image for back-end module
* Module descriptor for back-end module
* NPM package for front-end

(The module descriptor for a UI module is generated from `package.json` How can we similarly get the back-end module descriptor out of the container? There are implicit conventions but no actual specifications. If we define a metadata format for containers specifying things like how to extract the module descriptor, we would want it to be fully general so it does not depend on Java, on frameworks, or even on the use of JSON over HTTP.)

Both module descriptors are registered with Okapi.

Part of a platform could be an Okapi repository for the relevant modules.


### Deploying the module

In this case, we deploy the module (in this case `mod-courses`), typically by somehow starting its Docker container in a location where Okapi can reach it. There are several ways to do this:
* Okapi can deploy it, but this is rarely done in production
* A Kubernetes pod can spin up the container
* You could just start it from the command-line

There is often information necessary for deployment that is buried in the deployment section of the module descriptor. Apparently this can include things like which of the port numbers the module uses is the one that should be exposed to Okapi. This information was originally intended to be used by Okapi when it is doing deployment, but we also parse this out and use it to configure how we deploy using Kubernetes. But most of this information is (rightly) overridden or modified by information stored elsewhere as part of the orchestration system.


### Discovery for the module

Discovery in this context means telling Okapi where your module is.

Some people in the FOLIO community would prefer to have Okapi use Kubernetes' own discovery service. But this seems wrong because Okapi should not be Kubernetes-focussed but orchestration-neutral.


### Enabling the module for the tenant

We can use `simulate=true` to have Okapi tell us what it would do if we enabled the module, by way of enabling other modules.

**XXX Note.** We should have a way to do this from the Okapi Console.

**XXX Note.** We should probably be using the `install` endpoint as documented in the Okapi Guide.

Generally this will only do enable operations to make it possible for the current module to be enabled, but if we pass `deploy=true` Okapi will also try to deploy modules to satisfy requirements. But this is of no use when we are using Kubernetes for orchestration.



## Software Components

### UI modules

One part of most apps -- probably every app -- is a UI module that runs under Stripes. In some cases there may be multiple UI modules: for example, if we consider ERM to be an app, then it includes 


### Back-end modules

XXX


### Others

XXX



## Procedures

### UI installation

XXX


### Back-end installation

XXX


### Other installation

XXX


### Deployment

XXX



## Conclusion

XXX

