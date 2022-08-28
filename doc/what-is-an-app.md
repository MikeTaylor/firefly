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

One of the goals of [the Firefly project](https://github.com/MikeTaylor/firefly) is to make it simple to add an app to an existing FOLIO installation. To do this we need to be able to state clearly what are the things that make up the app, and what steps need to be performed in order to [add and enable the app](how-we-add-apps.md). This document aims to enumerate these things so we can start thinking in a more informed way about [what it would take to package them](package.md).



## Software Components

### UI modules

The most visible part of most apps is a UI module that runs under Stripes. In some cases there may be multiple UI modules: for example, if we consider ERM to be an app, then it includes
[`ui-agreements`](https://github.com/folio-org/ui-agreements),
[`ui-erm-comparisons`](https://github.com/folio-org/ui-erm-comparisons),
[`ui-erm-usage`](https://github.com/folio-org/ui-erm-usage)
and more.

A complication is introduced by UI plugin modules. For example,
[`ui-plugin-eusage-reports`](https://github.com/folio-org/ui-plugin-eusage-reports)
is invoked by both `ui-agreements` (as a handler) and `ui-erm-usage` (as a plugin). Does it for that reason count as a part of the ERM app?

A further complication is introduced by less specialised plugins that are potentially used by many apps. For example, [`ui-plugin-find-user`](https://github.com/folio-org/ui-plugin-find-user) has many applications in UI modules as diverse as
[`ui-checkout`](https://github.com/folio-org/ui-checkout),
[`ui-orders`](https://github.com/folio-org/ui-orders)
and
[`ui-courses`](https://github.com/folio-org/ui-courses). Does it for that reason constitute a part of one of those apps? Or is it part of all of them (and others)? When installing `ui-courses`, should `ui-plugin-find-user` be installed? Suppose multiple competing implementations of the `find-user` plugin-type are available: how should it be decided which of them is installed along with ui-courses?

UI modules specify (in their package file's `okapiInterfaces` section) which interfaces they rely on from back-end modules: but when there are multiple back-end modules that satisfy a required interface, how should it be decided which one is installed? Similarly: UI modules may specify (in their package file's `optionalOkapiInterfaces` section) interfaces that they can consume if provided, but do not strictly require. How should it be decided whether to install a back-end module to fulfil an optional interface?

Given all these degrees of choice, it seems inevitable that a fully-fledge app-store would need to offer interactive selection, with guidance that helps administrators make appropriate choices.


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

