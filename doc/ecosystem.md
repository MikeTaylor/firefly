# Towards a FOLIO module ecosystem

<!-- md2toc -l 2 ecosystem.md -->
* [Background: Flower Releases](#background-flower-releases)
    * [What is Flower Release actually is](#what-is-flower-release-actually-is)
    * [How a Flower Release is actually used](#how-a-flower-release-is-actually-used)
    * [Going beyond the Flower Release](#going-beyond-the-flower-release)
* [Towards a FOLIO module ecosystem](#towards-a-folio-module-ecosystem)
* [A way forward](#a-way-forward)
* [Some possible issues](#some-possible-issues)
    * [Docker namespaces](#docker-namespaces)
    * [NPM namespaces](#npm-namespaces)
    * [Namespaces in Stripes](#namespaces-in-stripes)
    * [App store metadata](#app-store-metadata)



## Background: Flower Releases

In [the MAFIA project](https://github.com/MikeTaylor/mafia), we have been asking the question of how we can make a FOLIO app available to customers and other FOLIO installations in a way other than it being in a flower release. But what does it even mean for a module to be in a flower release?


### What is Flower Release actually is

In technical terms, a flower release is defined by the contents of an [`install-extras.json`](https://github.com/folio-org/platform-complete/blob/master/install-extras.json) file on a branch in [`platform-complete`](https://github.com/folio-org/platform-complete). That is what the CI system uses to generate the usual configuration files, including `package.json` for the Stripes bundle and `stripes.config.js`. (For historical reasons, this file is misleadingly named.)

So the outcome of the long LDP approval process that the Technical Council is going through is that an entry gets added to `install-extras.json` saying `{ "id": "mod-ldp-1.0.1", "action": "enable" }`, and the branch containing that file is tagged with `R3-2021` or similar. (The actual flower names are not used in tags – they are only a marketing feature.)

A Flower Release is completed when the `R3-2021` tag is added.


### How a Flower Release is actually used

Once a Flower Release has been tagged and announced (usually on several FOLIO Slack channels by Oleksii Petrenko), it can be used by FOLIO customers. But how does this happen? How is the released artifact actually used? The details of the answer will vary between different organizations: notably, Index Data uses Kubernetes for deployment while EBSCO does not. But the principles will
be the same in all cases.

Index Data does not use `platform-complete` directly, because each customer tends to want slight changes from the Flower Release. So out first step when taking on a customer -- The University of Chicago, for example -- is to clone `platform-complete` to a customer-specific repository [`platform-uchicago`](https://github.com/indexdata/platform-uchicago) (a private repository).

Then the following steps (simplified) get things going:
```
git clone platform-uchicago
git checkout staging-environment
git merge R3-2021
```

Then we run the Ansible script [`create-tenants.yml`](https://github.com/indexdata/id-folio-infrastructure/blob/master/ansible/create-tenants.yml) from our [`id-folio-infrastructure`](https://github.com/indexdata/id-folio-infrastructure) repository to generate the relevant configuration files, insert the modules, etc.

It turns out that adding a module that is not included in a Flower Release is as simple as adding to `install-extras.json` in the customer’s platform repo — or, in practice, adding it to the files that are generated from that file. This is in fact how we handle `mod-lti-courses` for Duke.

And we also use that flexibility to _remove_ certain modules from our customers’ versions of the flower releases — for example, Index Data’s version of the Juniper release omits `mod-search`, the ElasticSearch module that we currently consider only at the experimental stage.


### Going beyond the Flower Release

It seems that when installing a FOLIO system, it is surprisingly easy to add a module that is excluded from, or remove a module that is included in, the underlying Flower Release. So how strongly does the fixed form of a Flower Release actually dictate what FOLIO customers get?

Since the module-descriptor repository (MDR) is implemented by an instance of Okapi, we could easily host our own to contain the descriptors of non-Flower-Release modules such as `mod-lti-courses`. We can use DockerHub as the container repository for those modules. And the standard NPM repository takes care of supplying UI modules. Together these three repositories could be seen as constituting a "FOLIO repo" which enables Okapi to pull modules from an Index Data space independent from the TC-controlled main space.used.


## Towards a FOLIO module ecosystem

But we can aim for a much more significant outcome than just supporting an Index Data-specific FOLIO repo. The broader FOLIO community can use this approach to provide a world of different repos, supported by many different vendors and customers, all providing FOLIO modules that are made available to any installation that wants them. Since Okapi can be configured to draw module descriptors from any number of upstream MDRs, there is no intrinsic limit.

As with Debian package repositories, we can imagine that different FOLIO repositories would offer different degrees of certification and service levels:
* The FOLIO Core repository (the only one that exists now) would furnish Flower Release modules that have been through the TC vetting process, the Bugfest process, etc., and almost any FOLIO installation would feel confident in using modules from that source.
* Index Data's FOLIO respository might provide modules that ID themselves have committed to support.
* A given university's FOLIO repository might provide only one or two locally developed modules that are of use elsewhere, as a means of peer-to-peer sharing of FOLIO developments.

Quite possibly, each FOLIO vendor would offer a repository containing their own offerings. At least, each vendor would have the option of doing so. In this way, the original vision of FOLIO as a dynamic community-driven project rather than a monolithic centralised project would become a reality.


## A way forward

To bring about this utopian future, we need a concrete sequence of achieveable steps. Here is one possible route, which has the recommendation of not requiring any new software development.

1. Write up in detail what is involved in creating a FOLIO Repository. We believe that we now understand this and it's pleasantly simple:
  * Stand up a publicly accessible Okapi in a well-known location such as https://repo.folio.indexdata.com
  * Protect that Okapi from being written to be outsiders, and furnish Index Data staff with credentials
  * Post to it the descriptors of modules that make up Index Data apps.
2. Create an Index Data FOLIO repository by doing the things listed in step 1 ([DEVOPS-945](https://jira.indexdata.com/browse/DEVOPS-945))
3. Make a "Hello world" FOLIO app, with both UI and server-side modules, and make it available via the Index Data repo ([FOL-37](https://jira.indexdata.com/browse/FOL-37))
4. Create CI workflows for locally developed FOLIO apps ([DEVOPS-946](https://jira.indexdata.com/browse/DEVOPS-946))
5. Create demonstration customer environment including MAFIA apps ([DEVOPS-947](https://jira.indexdata.com/browse/DEVOPS-947)). THe heart of this is configuring the Okapi of an Index Data-hosted FOLIO instance to read from this repo as well as the core one
6. Establish that this means of module delivery works as intended, fixing any the problems uncovered along the way.
7. Demo the concept of a non-Flower FOLIO repository to the community, and gather support for the decentralization intiative.
8. Use the Index Data FOLIO repo to host some real work done for a real customer -- for example, Duke's LTI Courses app, if we take over maintenance of that now their developer has moved on.
9. Announce the availability of the repository for other FOLIO installations to use.
10. Invite other FOLIO users to establish their own repositories. Perhaps host a list of publicly available FOLIO repositories.
11. Using Okapi's existing WSAPI, create a UI for the FOLIO repository. This might be another tab in the existing Okapi Console in `ui-developer`, or it could be a separate App Store.

Once this is done, the guardian role of the FOLIO Technical Council will become much better defined. There are two layers of standards/requirements:
1. What a module needs to do in order to run on a Okapi/Stripes platform
2. What a module needs to conform to in order to be maintainable by the core FOLIO teams

Part of the role of the Technical Council is to enforce the standards they consider appropriate for modules in the second category. But it's no part of their role to mandate the tools and approaches used by other teams to make modules that can be furnished via other FOLIO repos.


## Some possible issues

### Docker namespaces

We can store Docker container artifacts on Dockerhub rather than going to all the trouble of running our own hub. But we might want to create a separate Docker namespace for our FOLIO modules.

### NPM namespaces

Similarly, we will want to use an Index Data namespace in NPM for the UI modules that we release via our own FOLIO repo. We will need to register that namespace, which is [not quite a trivial process](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages).

### Namespaces in Stripes

We may need to modify Stripes so it can run our non-`@folio`-namespaced modules. We can probably easily enough make a one-line tweak (either in code or in config, we're not sure which) to enable any specific additional namespace, such as `@indexdata`, but we would rather make it open for any organization to use its own NPM namespace. (At present, Stripes decides what modules to transpile based on what namespace they are in, which is clearly wrong -- but we think this applies only in the case of pure libraries, not modules, so this will probably not _immediately_ cause us problem.)

### App store metadata

For the putative app-store, we will want to present pages about modules analogous to how Apple's app-store shows pages about its products, or how Steam shows pages about games. In the short term, at least, the only information we will have to hand is what's in the module descriptors. That gives is basic information and dependencies, but we will also want human-readable information. We think there is a space in module descriptors to store arbitrary metadata, so we can come up with a convention for using that. We will need to modify how `stripes mod descriptor` works so it passes through relevant fields from the NPM package file into the generate module descriptor.


