# Supporting FOLIO's cluster architecture in the Okapi Console

<!-- md2toc -l 2 cluster-architecture.md -->
* [Definitions](#definitions)
* [Platforms](#platforms)
    * [Module-version constraints](#module-version-constraints)
* [Use cases for the Okapi Console](#use-cases-for-the-okapi-console)
    * [System administrator](#system-administrator)
    * [Tenant administrator](#tenant-administrator)
* [Appendix A: sequences of Okapi operations in different scenarios](#appendix-a-sequences-of-okapi-operations-in-different-scenarios)
* [Appendix B: short-term tasks](#appendix-b-short-term-tasks)


## Definitions

By design, FOLIO is architecturally flexible. It can be run in many different ways, from a loose selection of modules running as processes on a single machine, up through containerised variants, Vagrant-controlled virtual machines, and other arrangements, to large, scalable production systems. In the face of all these possibilities, it can be difficult even to agree on terminology. Here is a set of terms, roughly from biggest to smallest, for the ingredients of Index Data's large-scale FOLIO deployments.

* _Kubernetes cluster_ -- [a set of nodes that run containerized applications](https://www.vmware.com/topics/glossary/content/kubernetes-cluster), allowing containers to run across multiple machines and environments.
* _Kubernetes namespace_ -- [one of several organizational divisions within the Kubernetes cluster](https://www.vmware.com/topics/glossary/content/kubernetes-namespace), e.g. "shared-production", "shared-staging"
* _Okapi cluster_ (also sometimes called an _Environment_) -- a cluster of Okapi instances, often running within a Kubernetes namespace, sharing some resources including persistant storage.
* _Tenant_ -- one of several individual sites supported by an Okapi cluster, each presenting as a separate installation that is isolated from other tenants.
* _Platform_ -- it's complicated (see below).

Not all of these levels are always present: for example, in the common case of a developer running their own FOLIO system in Vagrant VM, there is no involvement of Kubernetes at all, the Okapi "cluster" is a single Okapi process, and typically only a single tenant (usually Diku) is supported.


## Platforms

A FOLIO system can be assembled from any combination of modules, in any versions. But trying to support all possible combinations is not feasible. Instead it may be better to define a small set of supported _platforms_ -- sets of modules in particular versions which have been tested together and and known with reasonable confidence to work together. The flower releases (juniper, kiwi, etc.) are platforms in this sense.

A platform is an organisational tool rather than a piece of software, and can be implemented at the level of an Okapi cluster or at the higher levels of a Kubernetes namespace or cluster. A single Okapi cluster may provide multiple platforms, and tenants may choose between them. Each platform defines a set of modules at specific versions, and each tenant using that platform can make its own selection of which of those modules to enable. In general, tenants running on a given platform will run different sets of modules (e.g. a library that circulates physical books will need different modules from a library that manages only electronic resources), but where they share modules, they use the same versions.

Note that GitHub repositories such as [platform-complete](https://github.com/folio-org/platform-complete) confuse the issue by providing two quite separate things:
* [`package.json`](https://github.com/folio-org/platform-complete/blob/master/package.json), which is something like a platform in the present sense, in that it specifies which versions of which UI modules are to be included (but does not do the same for back-end modules)
* [`stripes.config.js`](https://github.com/folio-org/platform-complete/blob/master/stripes.config.js), which is the UI-side configuration for a single tenant -- selecting from among the modules furnished by the platform, and getting whatever versions of those modules the platform has chosen.

### Module-version constraints

FOLIO's software imposes certain constraints on which versions of a given module can co-exist in different contexts:
* An environment can provide many different versions of a given module, including multiple minor versions within a single major version.
* A tenant can enable multiple _major_ versions of a given module, but not multiple minor versions within a single major version.

But this flexibility may be of little value in practice. The notion of platform outlined above makes the choice, for the sake of administrative tractability and ease of support, to provide only one version of each module. Since platforms are defined at the level of the Okapi cluster and above, that constraint applies at the levels of environment and tenant.


## Use cases for the Okapi Console

In building the Okapi Console stripes module (currently being prototyped as part of Developer module), we may want to support two quite distinct use cases, corresponding to the Environment and the Tenant respectively.

### System administrator

This role is responsible at the level of the Okapi cluster, performing operations not limited to a single tenant. A system administrator might want to [install modules from packages (when that becomes possible)](package.md), deploy and undeploy installed modules, and perhaps enable and disable them for tenants.

This aspect of Okapi Console functionality is currently underspecified. Figuring out what we want the relevant pages to look like is an important next step in the current work.

**Note.**
In order to perform these operations, the administrator will need very powerful permissions. It would not be appropriate to assign these permissions to the adminstrator of any regular tenant, because it should not be possible for tenant adminstrators to do anything that affects the behaviour of other tenants that happen to be running on the same Okapi cluster. This role would have to be performed by the supertenant administrator, which means that it would be necessary to set up a Stripes bundle for the supertenant. Because of the present dependency of Stripes' login process on `bl-users`, and its dependency on the concept of service-points, and their involvement with inventory, it would at present be necessary to enable many more back-end modules than the supertenant administrator would actually need. This is one more reason why we really need to address the Modular Monolith problem in ([FOLIO-3253](https://issues.folio.org/browse/FOLIO-3253) and [stripes-core pull-request 1101](https://github.com/folio-org/stripes-core/pull/1101)).

### Tenant administrator

This is a simpler role, focussed on enabling and disabling modules on behalf of the tenant. So far as back-end modules are concerned, this requirement seems to be met already by the Modules tab of the Okapi Console.

We will probably want to enhance this page so that enabling or disabling a UI module causes a new Stripes bundle to be built.

In future, the tenant administrator might want to use the console to maintain other aspects of the tenant configuration that are presently held in the [`stripes.config.js`](https://github.com/folio-org/platform-complete/blob/master/stripes.config.js) file:
* Configuration elements such as logging categories and prefix, paging limits, and the welcome message. See the `config` entry in [the **The Stripes object** section of _The Stripes Module Developer's Guide_](https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md#the-stripes-object) for details.
* Branding information such as the log (and its alt-text) and favicon.
* Probably _not_ the Okapi details: URL and tenant name.


## Appendix A: sequences of Okapi operations in different scenarios

As we come to think more about what the system-administrator part of the Okapi Console should look like, we will need to bear in mind several different ways of managing module deployment.

1. Okapi itself manages deployment using [the `/_/deployment` or `/_/discovery` endpoints](https://github.com/folio-org/okapi/blob/master/doc/guide.md#deployment-and-discovery). This is typically used in small, self-contained FOLIO instances such as those in Vagrant VMs. We can build Okapi Console functionality to do this.
2. Kubernetes or some other external orchestration mechanism does the heavy lifting, and posts information to Okapi's discovery service to tell it what it's done. This is how we run real production systems. It seems that it will not be possible to build Okapi Console functionality for this. (We could possibly have the console control Kubernetes via its WSAPI, but then it would be a Kubernetes Console, not an Okapi Console.)
3. Okapi indirectly manages deployment by issuing commands to the Kubernetes WSAPI. Some work was done a while back towards extending Okapi to be able to do this, but it seems to have stalled. If this was completed, the Okapi Console could use these facilities to manage deployment via Kubernetes. But there is some feeling that doing this, even if the necessary Okapi work were completed, might not be a good fit for how Kubernetes is meant to be used.


## Appendix B: short-term tasks

* Interfaces tab should omit system interfaces (those beginning underscore)
* Interfaces tab should say which module implements each interface
* Persist error messages in callouts when enable/disable fails
* Give some help in disabling UI modules before their back-end modules


