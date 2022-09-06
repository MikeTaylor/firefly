# Deploying and enabling modules in multi-tenant clusters

<!-- md2toc -l 2 deploy-and-enable.md -->
* [Introduction](#introduction)
* [The way things are](#the-way-things-are)
    * [Installing the module descriptor (for all tenants)](#installing-the-module-descriptor-for-all-tenants)
    * [Deploying the module (for all tenants)](#deploying-the-module-for-all-tenants)
    * [Enabling the module (per tenant)](#enabling-the-module-per-tenant)
    * [Permissions](#permissions)
    * [Multiple versions of a module](#multiple-versions-of-a-module)
* [Issues](#issues)
    * [Kafka messaging](#kafka-messaging)
    * [The Okapi console](#the-okapi-console)



## Introduction

For simplicity, FOLIO module developers usually run their in-progress modules in single-tenant installations with a single node. Because of this, we can often overlook important parts of how Okapi works. In this document, I try to lay our when and where multi-tenant issues or multi-node issues (which are independent) are important. Almost certainly there is nothing here that is not already in [the Okapi Guide and Reference](https://github.com/folio-org/okapi/blob/master/doc/guide.md), but this document is worth writing for two reasons:
1. To have it all in one place, in a single short document
2. Because writing it will force me to crystalise the ideas in my own mind.



## The way things are


### Installing the module descriptor (for all tenants)

Before Okapi can do anything with a module, it needs to have that module's descriptor POSTed to `/_/proxy/modules`. This tells it which paths the module supports, so it can proxy requests that use those paths to the module in question, and how to launch the module (see below).

Okapi either does or does not know about a module: this is not on a per-tenant basis.

When a module descriptor is posted to one Okapi node in a cluster, all the other nodes are informed: it makes no difference which one is used.


### Deploying the module (for all tenants)

Module deployment can be done in many different ways, including by Okapi itself. In all cases, deployment is not specific to a tenant: deployed modules may be used by one tenant or many (or indeed none).

Modules are deployed to a specific node, not to the cluster as a whole. A given node may be running zero, one or more instances of a module.

Okapi itself deploys modules by POSTing a deployment descriptor to `/_/discovery/modules`. This descriptor tells Okapi which node to deploy on, and which module to deploy, passing the module's ID as the `srvcId` field. It uses information from the launch descriptor, which can either embeded directly in the deployment descriptor, or will otherwise be extracted from the module descriptor.

Alternatively, the deployment descriptor can be POSTed to `/_/deployment/modules`, but in this case it must be sent the node that the module is to run on -- something that is typically not possible in production environments due to firewalling.

If the posted deployment descriptor omits the `nodeId` and instead includes `url`, then it is not instructing Okapi to start the module on any node, but instead telling it where the module is _already_ running. This is especially useful in development, when running an in-progress module locally.

**NOTE.**
Most of the examples in the Okapi Guide use an Okapi running in `dev` mode, so that there is a single node. The examples work by fetching the list of nodes, noting that there is only one, `localhost`, and using that. Running multiple nodes is described in [the _Running in cluster mode_ section](https://github.com/folio-org/okapi/blob/master/doc/guide.md#running-in-cluster-mode)


### Enabling the module (per tenant)

A module can only be used when it has been enabled for a specific tenant, by POSTing the module identifier to `/_/proxy/tenants/TENANT/modules` for some value of _TENANT_. This needs to be done separately for each tenant that is to use the module. When a module is enabled for a tenant on one node of a cluster, it is enabled for all nodes -- or, to put it another way, enabling/disabling modules is nothing to do with nodes at all.


### Permissions

When a module is enabled for tenant -- whether it is a backend module that Okapi will proxy to or a UI module which it will not -- any permissions defined in that module's descriptor are made available on the tenant.

(This is done by means of [Okapi's special `_tenantPermissions` interface](https://github.com/folio-org/okapi/blob/master/doc/guide.md#permissions-and-the-_tenantpermissions-interface). A module implementing this interface, when it is enabled for a tenant, is passed information about the permissions of every already-enabled module; and it are passed information about any further modules that are subsequently enabled for that tenant at the time they are enabled. [`mod-permissions`](https://github.com/folio-org/mod-permissions) implements this interface, and so assumes responsibility for managing the permissions passed to it.)


### Multiple versions of a module

Okapi is happy to proxy for multiple versions of a module. More precisely, it will proxy for multiple versions of a module that provide different versions of an interface; similarly it will proxy for different modules that provide the same interface.

However, it will not allow you to enable clashing modules for a single tenant. Okapi may know about `mod-foo` version 2.2 and `mod-foo` version 2.3, and that's just fine: but they cannot both be enabled for the same tenant. Similarly, it may know about `mod-quux2` and `mod-quux2` that both provide the `quux` interface; but a given tenant can choose only one of these implementations.

This is how platforms can be implemented within an Okapi cluster. A platform is a set of modules that work together, such as the Users and Inventory modules from Juniper, or the same set of modules from Kiwi. An Okapi cluster can be aware of both platforms -- all four modules in this cut-down example. A given tenant may be on the Juniper platform, using the older versions of Users and Inventory, or on the Kiwi platform, using the newer versions. But no tenant can have both old and new versions of any module. A tenant can be upgraded from Juniper to Kiwi by disabling the old versions of the modules and enabling the new.



## Issues


### Kafka messaging

There are problems with how Kafka messages are received by modules. This works out OK most of the time, but will probably go wrong in a multi-tenant, multi-platform installation when upgrading a tenant from one platform to another. See [FOLIO-3526](https://issues.folio.org/browse/FOLIO-3526) for details.

There are also issues with inter-tenant message-snooping when Kafka is used. See [Temporary Kafka security solution](https://wiki.folio.org/display/DD/Temporary+Kafka+security+solution) and [Kafka Security](https://wiki.folio.org/display/~vbar/Kafka+Security). Although this is a potentially serious hole, it does not seem to be perceived as urgent.


### The Okapi console

When providing Okapi Console functionality for performing these operations, we will need to be careful to present the right functions to the right people.

* We will need a locked-down and highly secure FOLIO Administrator tenant, probably providing only the Okapi Console and maybe one or two other modules, which can be used to insert new modules and deploy them.
* We will use the existing regular tenants to allow tenant administrators to enable and disable modules (and rebuild Stripes bundles after having done so).



# Notes from Adam (to be integrated)

Module descriptors and deployment is not tenant specific. Period. Even mentioning tenants in this context is misleading, but you can do it to avoid misunderstandings. "deployed modules may be used by one tenant or many (or indeed none)." . There's an important zero case. Used by zero tenants. Again, it's not tenant specific :slightly_smiling_face:

install/enable is always tenant specific. One tenant is given as path parameter.

If you haven't read the okapi guide, you should - it documents the two system interfaces _tenant and _tenantPermissions, but also describes deployment, discovery and proxy which are the main categories of what Okapi provides. Also the README.md of mod-permissions is not too bad either.

The "Enabling the module" should also mention the install call. The install call (perhaps a bad name) is just a multi-enable/disable thingy. The single enable API is really not useful any more. See https://github.com/folio-org/okapi/blob/master/doc/guide.md#install-modules-per-tenant

The install example, illustrates the situation in August 2017.. During those days pulling in mod-users-bl pulled in a total of 4 modules (including mod-users-bl). Those were the days.
