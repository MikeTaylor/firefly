# Supporting FOLIO's cluster architecture in the Okapi Console

<!-- md2toc -l 2 cluster-architecture.md -->
* [Definitions](#definitions)
* [What is a "platform"?](#what-is-a-platform)
* [Module-version constraints](#module-version-constraints)
* [Sequences of Okapi operations in different scenarios](#sequences-of-okapi-operations-in-different-scenarios)
* [Use cases for the Okapi console](#use-cases-for-the-okapi-console)
    * [System administrator](#system-administrator)
    * [Tenant administrator](#tenant-administrator)
* [Appendix: short-term tasks](#appendix-short-term-tasks)


## Definitions

By design, FOLIO is achitechturally flexible. It can be run in many different ways, from a loose selection of modules running as processes on a single machine, up through containerised variants, Vagrant-controlled virtual machines, and other arrangements, to large, scalable production systems. In the face of all these possibilities, it can be difficult even to agree on terminology. Here is a set of terms, roughly from biggest to smallest, for the ingredients of Index Data's large-scale FOLIO deployments.

* _Kubernetes cluster_ -- [a set of nodes that run containerized applications](https://www.vmware.com/topics/glossary/content/kubernetes-cluster), allowing containers to run across multiple machines and environments.
* _Kubernetes namespace_ -- [one of several organizational divisions within the Kubernetes cluster](https://www.vmware.com/topics/glossary/content/kubernetes-namespace), e.g. "shared-production", "shared-staging"
* _Okapi cluster_ (also sometimes called an _Environment_) -- a cluster of Okapi instances, often running within a Kubernetes namespace, sharing some resources including persistant storage.
* _Tenant_ -- one of several individual sites supported by an Okapi cluster, each presenting as a separate installation that is isolated from other tenants.
* _Platform_ -- it's complicated (see below).

Not all of these levels are always present: for example, in the common case of a developer running their own FOLIO system in Vagrant-controlled virtual machine, there is no involvement of Kubernetes at all, the Okapi "cluster" is a single Okapi process, and typically only a single tenant (usually Diku) is supported.


## What is a "platform"?

A FOLIO system can be assembled from any combination of modules, in any versions. But trying to support all possible combinations is not feasible. Instead it may be better to define a small set of supported _platforms_ -- sets of modules in particular versions which have been tested together and and known with reasonable confidence to work together. The flower releases (juniper, kiwi, etc.) are platforms in this sense.

A platform is an organisational tool rather than a piece of software, and can be implemented at the level of an Okapi cluster or at the higher levels of a Kubernetes namespace or cluster. A platform defines which modules are provided by an environment and at what versions, and each tenant of that environment can make its own selection of which modules to enable. In general, tenants running in an environment will run different modules (e.g. a library that circulates physical books will need different modules from a library that manages only electronic resources), but where they share modules, they use the same versions.

Note that GitHub repositories such as [platform-complete](https://github.com/folio-org/platform-complete) confuse the issue by providing two quite separate things:
* [`package.json`](https://github.com/folio-org/platform-complete/blob/master/package.json), which is something like a platform in the present sense, in that it specifies which versions of which UI modules are to be included (but does not do the same for back-end modules)
* [`stripes.config.js`](https://github.com/folio-org/platform-complete/blob/master/stripes.config.js), which is the UI-side configuration for a single tenant -- selecting from among the modules furnished by the platform, and getting whatever versions of those modules the platform has chosen.


## Module-version constraints

XXX TODO

An environment can run many different versions of a given module, including multiple minor versions within a single major version.

Any given tenant can enable multiple major versions of a given module, but only one minor version of each major.

A platform provides only one version of each module.


## Sequences of Okapi operations in different scenarios

* Class 1: Okapi does deployment using `/_/deployment`
* Class 2: Kubernetes does the heavy lifting
* Class 3: (does not exist): Okapi telling Kubernetes what to do


## Use cases for the Okapi console

XXX TODO


### System administrator

XXX TODO

Deploy modules, and maybe enable them for tenants


### Tenant administrator

XXX TODO

What modules do I want to enable?

Should be handled by the Modules tab of the current Okapi Console


## Appendix: short-term tasks

* Persist error messages in callouts when enable/disable fails
* Give some help in disabling UI modules before their back-end modules
* Interfaces tab should omit system interfaces (those beginning underscore)
* Interfaces tab should say which module implements each interface


