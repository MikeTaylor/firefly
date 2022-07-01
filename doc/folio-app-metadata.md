# The FOLIO App Metadata (FAM) file format

<!-- md2toc -l 2 folio-app-metadata.md -->
* [Introduction](#introduction)
* [High-level concerns](#high-level-concerns)
    * [What metaformat should we use?](#what-metaformat-should-we-use)
    * [What exactly does this file represent?](#what-exactly-does-this-file-represent)
* [File format](#file-format)
* [Example](#example)
* [Open issues](#open-issues)


## Introduction

[Broader discussions](https://github.com/MikeTaylor/mafia/blob/master/README.md#documents) about FOLIO modularity have brought us to the point where we need to make a concrete proposal for what the FOLIO App Metadata file might look like -- partly in the hope that we can actually implement it soon, but more immediately because writing down specifics will surface problems. This document is a proposal for discussion.


## High-level concerns

### What metaformat should we use?

A bespoke file format along the lines of [what zSQLgate uses](https://metacpan.org/release/MIRK/Net-Z3950-DBIServer-1.07/source/examples/books/books.nzd) is always pleasant. But it requires development time that we don't have, so something off-the-shelf is more reasonable.

XML is ugly; YAML is elegant, but prone to subtle errors. That leaves JSON as the front-runner by default, despite its unnecessarily pickiness. Since we use JSON widely through FOLIO, its use here is consonant with the broader project. It does at least provide built-in representation of structures and arrays.

### What exactly does this file represent?

The FOLIO App Metadata file represents metadata for an app, yes, but what exactly is included in an app? For the model app, Harvester Admin, the answer is simple: it's the `ui-harvester-admin` Stripes package and the `mod-harvester-admin` backend package. But there are more complex cases. For example, the ERM app potentially includes multiple Stripes packages (Agreements, eHoldings, ERM Comparisons, eUsage?), some of them optional, each with different backend requirements, some of them with optional or mandatory
plugins and perhaps other requirements. We want the generality of the FAM file to be able to represent such requirements.

For now, we will limit ourselves to the simple case, but we need to remain aware of more complex ones.

These files have two purposes: to present the information needed when browsing and searching apps in the app-store, and to provide the information required to actually install and enable the app.

### Trust

When someone downloads software from Index Data's site, they trust it because they trust the source -- only Index Data personnel can place software on that site. But when anyone can make FOLIO apps available, and when apps from multiple sources appear together in an app-store, how can users know what to trust?

One approach is a top-down certification program, where the organization running the app-store assumes responsibility for a level of quality and security -- much as Apple does with its own app-store. But for FOLIO, we very much want a decentralized approach where there is no single gatekeeper. Instead, we want to give users confidence that an app is published by the organization that it claims, and let them choose which organizations to trust as they do now.

The simplest way to do this is for the publishing organization to use its own private key to encrypt the `elements` section of the app metadata file, and store the result in a "checksum" field. Then users (or more likely their software) can verify that this field correctly decrypts using the organization's public key, which it can publish on its own website or in a well-known key-server.


## File format

The file is a JSON object with the following top-level keys:

| Name          | Type   | Required? | Description |
| ------------- | ------ | --------- | ----------- |
| `name`        | string | Yes       | Machine-readable name of the app, should generally match the filename
| `displayName` | string |           | Human-readable name of the app, defaults to value of `name` if not specified
| `version`     | string | Yes       | Three-faceted version number, subject to Semantic Versioning, which is the version of the app _as a whole_, not necessarily equal to the version number of any part of it
| `description` | string |           | Longer human-readable description of the app, written in Markdown
| `publisher`   | string | Yes       | The organization responsible for publishing the app, expressed as the domain-name of the organization's primary web-site
| `checksum`    | string | Yes       | The `elements` array below, rendered into a minified string form and encrypted using the publisher's private key (see above)
| `elements`    | array  | Yes       | (see below)

The `elements` field is an array descriving each of the software elements (UI and backend modules) that make up the app. Each entry is a JSON objct with the following keys:

| Name          | Type   | Required? | Description |
| ------------- | ------ | --------- | ----------- |
| `type`        | string | Yes       | `ui` or `backend`: used so that installer software can determine what to do with the package
| `package`     | string | Yes(*)    | The name of the UI or backend package according to the appropriate conventions (i.e. Node package name or Docker container name)
| `repository`  | string | Yes(*)    | The repository in which the nominated package can be found, if not the standard place
| `url`         | string |           | May perhaps be used in place of both `package` and `repository` to link directly to the relevant artifact
| `descriptor`  | string |           | For backend modules, a link to the module descriptor in a FOLIO registry. (For UI modules, the descriptor can be obtained from the NPM package)


## Example

This simple example FAM file describes the components of the Harvester Admin app.

<!-- XXX Update with contents of ../examples/harvester-admin.fam -->
```
{
  "name": "harvester-admin",
  "displayName": "Harvester admin",
  "version": "0.0.1",
  "description": "Admin console for the Index Data Harvester",
  "publisher": "indexdata.com",
  "checksum": "1a2b3c4d5e6f7g8h9i0j",
  "elements": [
    {
      "type": "ui",
      "package": "@indexdata/harvester-admin",
      "repository": "https://repository.folio.org/repository/npm-folio/",
      "url": ""
    },
    {
      "type": "backend",
      "package": "",
      "repository": "",
      "url": "https://github.com/indexdata/mod-harvester-admin/pkgs/container/mod-harvester-admin/22772237?tag=v0.1.0-SNAPSHOT.7",
      "descriptor": "https://registry.folio-dev.indexdata.com/_/proxy/modules/mod-harvester-admin-0.1.0-SNAPSHOT"
    }
  ]
}
```


## Open issues

* There is some duplication in the high-level fields (`name`, `version`, etc.) of what is found in the Node package file for the UI module. This is probably inevitable, as we will in general need to give different information here, especially for complex apps like ERM which contain multiple UI apps.
* How do we specify what is required and what is optional?
* Is a linear list of elements enough, or do we need to express dependencies somehow?
* How will these dependencies, if we add them, play in with those expressed by `okapiInterfaces` in Stripes modules?
* How do the `package` and `repository` fields interact, and would a single `url` fields be better? (In the example above, we use the former for the UI module and the latter for the backend module).
* Do we want some level of certification with machine-readable representations?


