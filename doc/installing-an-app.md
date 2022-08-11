# Installing the Harvester Admin app from the FAM file

<!-- md2toc -l 2 installing-an-app.md -->
* [Introduction](#introduction)
* [The build process](#the-build-process)
    * [Overview](#overview)
    * [Backend module](#backend-module)
    * [UI module](#ui-module)
* [Open issues](#open-issues)



## Introduction

To help us ground [the FAM file format](folio-app-metadata.md) in reality, we dry-ran [the Harvester Admin example](https://github.com/MikeTaylor/mafia/blob/master/examples/harvester-admin.fam) and figured out what exactly would need  to be done. The goal is that this information will enable us to write a script that can automate the process.



## The build process


### Overview

The are two elements in the Harvester Admin FAM file: a single back-end module and a single UI module. Other FAM files will be more complex, but we will begin with this simple case. Both backend and UI modules will need to be fetched and deployed as part of a single script or UI action run by [the FOLIO administrator](roles.md#folio-administrator). Enabling the modules for individual tenants is a separate process which will be handled by the various [tenant administrators](roles.md#tenant-admininstrator).


### Backend module

1. The module descriptor needs to be posted to the local Okapi so it knows how to proxy to the module. The descriptor is linked directly from the example file, as `elements[1].descriptor`. This can be downloaded, and the resulting descriptor uploaded to the local Okapi in the usual way. The URL can be treated as an opaque string.

2. The module needs to be run. Some vendors ignore container builds and compile from source code, but we can ignore that approach as out of scope for now (and support it later, if necessary, by adding a `sourceUrl` field to the FAM file's `elements` entries). The great majority of vendors use the container builds, either with Docker or some equivalent -- but there is still great variation in how this is done due to the use of different orchestration software. At Index Data we use Kubernetes, and will create tooling that uses its WSAPI or command-line tools to start the module, using information from the launch descriptor as necessary (see below).

3. Okapi needs to be told where to find the running module, as deployed on Kubernetes or similar, by posting to  `/_/discovery/modules` a deployment descriptor that relates the module descriptor ID to the URL of the running instance. (It is possible to post multiple deployment descriptor to inform Okapi of multiple running instances, but we don't do that because Kubernetes does its own scaling and presents a facade of a single endpoint).

Once more, note that enabling the module for a tenant is _not_ part of this process: that is the job of the various tenant administrators, and can be done in the Modules tab of the existing Okapi Console in the developer settings.


### UI module

1. The module descriptor needs to be posted to the local Okapi exactly as for the back-end module.

2. The platform's Stripes `package.json` needs to be updated by adding the new module. This needs information that can be taken from the NPM package's own `package.json`. (This is easy to do with `yarn add` but it may be harder to remove packages in this way. Alternatively, we could completely rebuild the platform's package file from scratch every time we make a change.)

3. The newly generated package must have its dependencies downloaded and resolved by `yarn install`, so that they are ready to incorporate into new bundles.

Note that we do not rebuild the Stripes bundle as part of this process: that is the job of the various tenant administrators.



## Open issues

* Should the processes outlined above be run by the FOLIO adminstrator (who is responsible for the whole installation) or the platform administrator? Or are we starting to feel that maybe they are the same person?

* Backend modules must be inserted into Okapi before their corresponding UI modules so that dependencies are satisfied. This is easy in the present case where there is one module of each kind, but will be a more complex problem when dealing with larger apps that involve multiple backend modules with interdependencies. We can leave it to packagers to list elements in the right order, but it would be more polite to allow the elements to be listed in any order, and resolve a correct order by topologically sorting the interface dependencies expressed in the module descriptors.

* Launch information used by Kuberneters and other orchestration software is generated from information in the launch descriptor that is embedded in the module descriptor. Very minimal launch descriptors like that of `mod-harvester-admin` may not be adequate. Conceptually, though, launch descriptors are problematic. As part of the module descriptor, they should really contain only information about the module itself, such as "this should be allocated 512 Mb to run in". But at present, launch descriptors also include information about deployment, such as what port the container makes the module available on.

* Do the procedures outlined in this document leave behind enough information -- for example, in Okapi's internal state -- to support the subsequent procedure of enabling the app for a tenant? If not, then we will need to save state in some other form.



