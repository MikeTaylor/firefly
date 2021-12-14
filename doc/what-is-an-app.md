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

