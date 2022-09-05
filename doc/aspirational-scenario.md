# An aspirational scenario

<!-- md2toc -l 2 aspirational-scenario.md -->
* [Introduction](#introduction)
* [The steps](#the-steps)
    * [1. A library patron finds a useful FOLIO app in an app-store](#1-a-library-patron-finds-a-useful-folio-app-in-an-app-store)
    * [2. Hits an "I want this" button](#2-hits-an-i-want-this-button)
    * [3. The FOLIO system's administrator is notified](#3-the-folio-systems-administrator-is-notified)
    * [4. Verifies that the app is satisfactory](#4-verifies-that-the-app-is-satisfactory)
    * [5. Installs and enables it](#5-installs-and-enables-it)
    * [6. The tenant administrator enables the app](#6-the-tenant-administrator-enables-the-app)
    * [7. The app becomes available to the patron](#7-the-app-becomes-available-to-the-patron)
* [App-store roles](#app-store-roles)


## Introduction

This scenario is taken from [slide 32 of my WOLFcon 2022 talk _FOLIO modularity in practice: Seamless deployment of modules from multiple sources_](https://docs.google.com/presentation/d/1tBI8urMK-MU6w_bjO-cudSo3KySBHuTPjCVB_sP6ECU/edit#slide=id.g14880cf783d_0_85). It's useful as a concrete use-case that can help guide us in designing and building the Firefly components.

(We will certainly need other scenarios in time, including: install a more complex app; remove an app; substitute a component of an existing app; boot up a complete FOLIO ILS from a `platform-minimal`. But we'll start with one, and see where we go from there.)


## The steps

### 1. A library patron finds a useful FOLIO app in an app-store

Consider for example a patron in a small library, who browses a FOLIO app-store and notices that Duke University has released a new app for booking rooms.

### 2. Hits an "I want this" button

At the level of use provided to a regular patron, the only option offered by the app-store is to hit an "I want this" button: regular users cannot directly affect the operation of the system.

### 3. The FOLIO system's administrator is notified

This should be done automatically, perhaps using `mod-notify`. Ideally, the patron would be notified that his request is in a queue.

(We could if we wish first pass the request through the patron's tenant administrator. This would be step 2.5.)

### 4. Verifies that the app is satisfactory

The FOLIO administrator, having been notified of the request, examines the app and makes a judgement about whether it's OK to install. This will be dependent largely on the app's certifications: it may be enough that these show it to have been made by Duke University; or the administrator may also want to ensure that the app meets local requirements for internationalization or other criteria. He may even want to examine the code for himself.

### 5. Installs and enables it

Having satisfied himself that the app is acceptable, the FOLIO administrator hits a button on the app-store to download, install and deploy the app. The tenant administrator of the patron's tenant is informed of the patron's request, and of the app's availability.

We will need to think about whether and how to allow the FOLIO administrator to set parameters such as number of running instances and allocated memory.

(If the FOLIO administrator deems the app unacceptable, the patron should be informed that his request is declined.)

### 6. The tenant administrator enables the app

Assuming the tenant adminstrator is happy for the app to be enabled, he hits a button on the app-store to enable the app for his tenant. (This entails rebuilding the Stripes bundle.) The patron is informed that the app is now available.

(If the tenant administrator deems the app unacceptable, the patron should be informed that his request is declined.)

### 7. The app becomes available to the patron

The next time to patron logs into his tenant, the requested app is available and ready to be used.


## App-store roles

Note that throughout this process, the app-store plays three very different roles:
* For the patron, it is only a source of apps that can be requested.
* For the FOLIO administrator, it is the source of the concrete components of the app, and the means by which these are downloaded, installed and deployed.
* For the tenant administrator, it is the means of enabling and disabling available the apps furnished by the FOLIO administrator.

It is an open question whether the same app-store UI should be used in all three situations, or whether two or three different UIs would be more appropriate.


