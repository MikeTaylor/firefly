# FOLIO app metadata in module descriptors

<!-- md2toc -l 2 folio-app-module-descriptor.md -->
* [Introduction](#introduction)
* [Advantages](#advantages)
* [Disadvantages](#disadvantages)
* [Extensions required to the module-descriptor format](#extensions-required-to-the-module-descriptor-format)
* [Interfaces vs implementations](#interfaces-vs-implementations)
* [Deployment](#deployment)


## Introduction

The proposed [FOLIO App Metadata (FAM) file format](folio-app-metadata.md) was generally well received by the MAFIA working group, but one important question was raised: do we need a new format at all, or can we just extend the existing [module descriptor format](https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json)?

If we take this approach, then as well as being used to inform Okapi of machine-readable properties of modules, these descriptors will also be used by the App Store to advertise high-level modules (i.e. "apps") to human users and by deployment software to obtain, install and start them.

If this approach is to work well, we need to ensure that the format is general enough to handle:
* Both UI and backend modules
* Artifacts from various different places, e.g. GitHub Packages, DockerHub, global NPM registry, FOLIO NPM registry
* Different approaches to deployment, e.g. Kubernetes vs Amazon ECS vs Docker Swarm

As always, we must remember the fine motto of the X windows system:
**Mechanism, not policy**.


## Advantages

This approach is appealing for several reasons.

First and most obviously, it avoids multiplying entities. Okapi already has module descriptors, deployment descriptors, tenant association descriptors and (embedded in a module or deployment descriptor) launch descriptors. Adding yet a fifth descriptor for apps might seem excessive. (Alternatively, it could be argued that when there are aready four kinds of descriptor, what's one more?)

Second, by expressing an what an app is in terms of a "virtual module", we have the possibility of recursive dependencies. A high-level app like "ReShare" could include a low-level add "Supply", which in turn could include individual modules such as `ui-supply`, `ui-rs` and `mod-rs`.


## Disadvantages

First, there is the philosophical question of whether the proposed changes extend the meaning of a module descriptor too far to be comfortable. As noted above, the same file would then be fulfilling three quite different roles (proxy maps, app-store entries and deployment instructions), and that may be less elegant than a separate format.

Second, there is the practical difficulty that changing an existing format is more difficult than creating a new one: we will need to ensure that the new fields don't impede Okapi from interpreting the descriptor as previously, and wrestle our changes through a potentially obstructive pull-request process.

Third, it may be more difficult to get the wider community to accept changes to an existing format than to quietly introduce a new one whose use is optional. The difficulty of this can be reduced by ensuring that every change we make to how the module descriptor works is 100% backwards-compatible -- as of course it should be anyway.


## Extensions required to the module-descriptor format

In order to allow the module descriptor to express all the requirements outlined in [The FOLIO App Metadata (FAM) file format](folio-app-metadata.md), the following additional fields from that document will need to be added:

| Name          | Type   | Required? | Description |
| ------------- | ------ | --------- | ----------- |
| `displayName` | string |           | Human-readable name of the app, defaults to value of `name` if not specified
| `version`     | string | Yes       | Three-faceted version number, subject to Semantic Versioning, which is the version of the app _as a whole_, not necessarily equal to the version number of any part of it. **Note.** At present this is stored as part of the `id` field; that may be sufficient for our purposes, though inelegant.
| `description` | string |           | Longer human-readable description of the app, written in Markdown
| `publisher`   | string | Yes       | The organization responsible for publishing the app, expressed as the domain-name of the organization's primary web-site
| `checksum`    | string | Yes       | Some part of the record -- maybe all of it except this field -- rendered into a minified string form and encrypted using the publisher's private key (see above)

Apart from `name`, which already exists in the module descriptor format, this means we would need to bring across all the proposed fields of the FOLIO App Metadata format with the sole exception of `elements`.


## Interfaces vs implementations

But the `elements` field, too, is problematic. This field in the proposed FAM format indicates not which _interfaces_ an application needs to have fulfilled, but what _modules_ it need: in other words, it is explicitly and deliberately a dependency on implementation rather than on interface. The module descriptor as it stands has no way to nominate depended-upon modules, only interfaces.

Is this a bug or a feature?

On one hand, we want an app-store to be a one-stop shop: you say "I want the Harvester Admin app", and you don't want to be bothered by having to choose which to choose from among the various candidate modules fulfil the relevant interfaces. You want the app packager to have the responsibility of making those choices, so you don't have to. We also want the option of just giving an app file to an installer and expecting it to get on with it, free of further interaction.

On the other hand, maybe sometimes we _do_ want the flexibility to install and app using one of several candidate implementations. If we took this route, the app store would need a way to prompt the user for a choice, and probably to suggest a reasonable default.

At present, this discussion is hard to think through, because it remains difficult to think of even a single example of a module with an interface dependency that can be met by multiple candidate implementations. (There are multiple implementations of the `codex` interface -- `mod-codex-mux`, `mod-codex-inventory`, `mod-codex-ekb` etc. -- but these are used together, not as a choice where one is chosen from among several options.)

So we are left thinking about how we _might_ want to handle the choose-an-implementation scenario when one arises. We certainly hope it will, but it's difficult and maybe dangerous to design the whole app-store around a scenario that does not yet exist. A better strategy is to design it around what does exist now (installing a single app from well-defined components) while being careful not to do this in a way that excludes the possibility of extending our approach when the day comes that we see alternative implementations in the field.

That means that relying only on the existing dependency mechanism of module descriptors (`requires` and `provides`) is not enough, and we need something like the `elements` entry proposed in [The FOLIO App Metadata (FAM) file format](folio-app-metadata.md).


## Deployment

[The existing launch descriptor](https://github.com/folio-org/mod-users/blob/fa523ff0fbc4076f11e863c88149dfed0e7c0dd7/descriptors/ModuleDescriptor-template.json#L493-L515) that can be embedded in a module descriptor may already contain all necessary artifact-location information for backend modules. If so, then the `elements` entries (or whatever equivalent thing we use) will not need to specify `package`, `repository` or `url`, as these will be implied by the module-descriptor.

Is this also true for UI modules? No, as these lack launch descriptors. And there is nothing in the generated module descriptor of a front-end module that specifies where to obtain the code.


