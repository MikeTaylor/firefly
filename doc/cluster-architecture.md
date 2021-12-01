# Supporting FOLIO's cluster architecture in the Okapi Console

<!-- md2toc -l 2 cluster-architecture.md -->
* [Definitions](#definitions)
* [Use cases for the Okapi console](#use-cases-for-the-okapi-console)
    * [Tenant administrator](#tenant-administrator)
    * [System administrator](#system-administrator)
* [Module-version constraints](#module-version-constraints)
* [To do](#to-do)


## Definitions

* _Kubernetes cluster_ -- top level thing
* _Kubernetes namespace_ -- one of several namespaces run by the Kubernetes cluster, e.g. "shared-production", "shared-staging"
* _Okapi cluster_ (or _Environment_) -- a cluster of Okapi instances, often running within a Kubernetes namespace.
* _Tenant_ -- one of several individual tenants running within an Okapi cluster.


## Use cases for the Okapi console


### Tenant administrator

What modules do I want to enable?

Should be handled by the Modules tab of the current Okapi Console


### System administrator

Deploy modules, and maybe enable them for tenants


## Module-version constraints

An environment can run many different versions of a given module, including multiple minor versions within a single major version.

Any given tenant can enable multiple major versions of a given module, but only one minor version of each major.


## To do

* Persist error messages in callouts when enable/disable fails
* Give some help in disabling UI modules before their back-end modules
* Write up sequence of Okapi operations in running modules:
  * Class 1: Okapi does deployment using `/_/deployment`
  * Class 2: Kubernetes does the heavy lifting
  * Class 3: (does not exist): Okapi telling Kubernetes what to do
* Interfaces tab should omit system interfaces (those beginning underscore)
* Interfaces tab should say which module implements each interface


