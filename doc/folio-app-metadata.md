# The FOLIO App Metadata (FAM) file format

<!-- md2toc -l 2 folio-app-metadata.md -->
* [Introduction](#introduction)
* [High-level concerns](#high-level-concerns)
    * [What metaformat should we use?](#what-metaformat-should-we-use)
    * [What exactly does this file represent?](#what-exactly-does-this-file-represent)
    * [Trust](#trust)
* [File format](#file-format)
    * [Top level fields](#top-level-fields)
    * [Elements](#elements)
    * [Certification](#certification)
* [Example](#example)
* [Open issues](#open-issues)


## Introduction

[Broader discussions](https://github.com/MikeTaylor/mafia/blob/master/README.md#documents) about FOLIO modularity have brought us to the point where we need to make a concrete proposal for what the FOLIO App Metadata file might look like -- partly in the hope that we can actually implement it soon, but more immediately because writing down specifics will surface problems. This document is a proposal for discussion.


## High-level concerns

### What metaformat should we use?

A bespoke file format along the lines of [what zSQLgate uses](https://metacpan.org/release/MIRK/Net-Z3950-DBIServer-1.07/source/examples/books/books.nzd) is always pleasant. But it requires development time that we don't have, so something off-the-shelf is more reasonable.

XML is ugly; YAML is elegant, but prone to subtle errors. That leaves JSON as the front-runner by default, despite its unnecessarily pickiness. Since we use JSON widely through FOLIO, its use here is consonant with the broader project. It does at least provide built-in representation of structures and arrays.

### What exactly does this file represent?

The FOLIO App Metadata file represents metadata for an app, yes -- and [potentially also for a platform](fam-files-for-platforms.md) -- but what exactly is included in an app? For the model app, Harvester Admin, the answer is simple: it's the `ui-harvester-admin` Stripes package and the `mod-harvester-admin` backend package. But there are more complex cases. For example, the ERM app potentially includes multiple Stripes packages (Agreements, eHoldings, ERM Comparisons, eUsage?), some of them optional, each with different backend requirements, some of them with optional or mandatory
plugins and perhaps other requirements. We want the generality of the FAM file to be able to represent such requirements.

For now, we will limit ourselves to the simple case, but we need to remain aware of more complex ones.

These files have two purposes: to present the information needed when browsing and searching apps in the app-store, and to provide the information required to actually install and enable the app.

### Trust

When someone downloads software from Index Data's site, they trust it because they trust the source -- only Index Data personnel can place software on that site. But when anyone can make FOLIO apps available, and when apps from multiple sources appear together in an app-store, how can users know what to trust?

One approach is a top-down certification program, where the organization running the app-store assumes responsibility for a level of quality and security -- much as Apple does with its own app-store. But for FOLIO, we very much want a decentralized approach where there is no single gatekeeper. Instead, we want to give users confidence that an app is published by the organization that it claims, and let them choose which organizations to trust as they do now.

The simplest way to do this is for the publishing organization to use its own private key to encrypt the relevant parts of the app metadata file, and store the result in a signature field. Then users (or more likely their software) can verify that this field correctly decrypts using the organization's public key, which it can publish on its own website or in a well-known key-server. This is done using the `certifified` element as described [below](#certification).


## File format

### Top level fields

A FAM file is a JSON object with the following top-level keys:

| Name          | Type   | Required? | Description |
| ------------- | ------ | --------- | ----------- |
| `name`        | string | Yes       | Machine-readable name of the app, should generally match the filename
| `displayName` | string |           | Human-readable name of the app, defaults to value of `name` if not specified
| `version`     | string | Yes       | Three-faceted version number, subject to Semantic Versioning, which is the version of the app _as a whole_, not necessarily related to the version number of any of its constituent parts
| `description` | string |           | Longer human-readable description of the app, written in Markdown
| `elements`    | array  | Yes       | (see [below](#elements))
| `certified`   | array  | No        | (see [below](#certification))

### Elements

The `elements` field is an array describing each of the software elements (UI and backend modules) that make up the app. Each entry is a JSON object with the following keys:

| Name          | Type   | Required? | Description |
| ------------- | ------ | --------- | ----------- |
| `type`        | string | Yes       | `ui`, `backend` or `fam`: used so that installer software can determine what to do with the package
| `url`         | string | Yes       | A direct link to the relevant artifact (NPM package, Docker container, or FAM file)
| `descriptor`  | string | No        | A link to the module descriptor in a FOLIO registry. Required except when `type` is `fam`.
| `required  `  | boolean| No        | True if the module must be included for the app to function; false if it an optional extra. Default: true

### Certification

The `certified` field is an array containing zero or more certifications, attesting to some property of the published app and cryptographically signed by some agent that is willing to take responsibility for the app's possession of the certified property. Each entry is a JSON object with the following keys:

| Name          | Type   | Required? | Description |
| ------------- | ------ | --------- | ----------- |
| `type`        | string | Yes       | A short string taken from an enumerated set (see below) indicating what is being certified about the app.
| `certifier`   | string | Yes       | The organization responsible for certifying the app, expressed as the domain-name of the organization's primary web-site.
| `signature`   | string | Yes       | A cryptographic signature proving that the nominated organization certified the package. This is formed by taking the app file, removing every element of the `certified` array except the one with type `published` (which is part of its identity), rendering the thus reduced file as a minimized JSON string, and encrypting it with the organization's private key.

Certification types are short strings, and a small controlled vocabulary should be maintained assigning the strings well-known meanings. Types may include:

* `published` -- the package was published by the certifier in question, who takes responsibility for the choice of elements making up the package. This certification would generally be included in every app, while all the others are optional.
* `ux` -- the certifier asserts that the user interface of the app meets its own guidelines
* `i18n` -- the app is fully internationalized such that support for a new language can be added by means of a translations file.
* `a11y` -- the app meets [WCAG 2.1](https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines) accessibility guidelines
* `whitehat` -- the certifying organization has made an attempt to penetrate the security of the app, and asserts that it was unable to do so.

Some of these might appear multiple times with different certifiers: for example, there may be multiple UX certifiers and multiple white-hat security analysts.

The `published` type is special, as described above, in that it is the only part of the certification array that is included in signature. In other words, each additional certification is applied to the app metadata as originally published by its original publisher; but other than that, all certifications are independent, and can be added separately to an existing FAM file.


## Example

This simple example FAM file describes the components of the Harvester Admin app.

<!-- XXX Update with contents of ../examples/harvester-admin.fam -->
```
{
  "name": "harvester-admin",
  "displayName": "Harvester admin",
  "version": "0.0.1",
  "description": "Admin console for the Index Data Harvester",
  "elements": [
    {
      "type": "ui",
      "url": "https://repository.folio.org/repository/npm-folio/@indexdata/harvester-admin",
      "descriptor": "https://registry.folio-dev.indexdata.com/_/proxy/modules/indexdata-harvester-admin-0.0.1-SNAPSHOT",
      "required": true
    },
    {
      "type": "backend",
      "url": "https://github.com/indexdata/mod-harvester-admin/pkgs/container/mod-harvester-admin/22772237?tag=v0.1.0-SNAPSHOT.7",
      "descriptor": "https://registry.folio-dev.indexdata.com/_/proxy/modules/mod-harvester-admin-0.1.0-SNAPSHOT",
      "required": true
    }
  ],
  "certified": [
    {
      "type": "published",
      "certifier": "indexdata.com",
      "signature": "1a2b3c4d5e6f7g8h9i0j"
    },
    {
      "type": "ux",
      "certifier": "samhaeng.com",
      "signature": "1234567890abcdefghij"
    }
  ]
}
```


## Open issues

* There is some duplication in the high-level fields (`name`, `version`, etc.) of what is found in the Node package file for the UI module. This is probably inevitable, as we will in general need to give different information here, especially for complex apps like ERM which contain multiple UI modules.
* Is a linear list of elements enough, or do we need to express dependencies somehow? If the latter, how will these dependencies play in with those expressed by `okapiInterfaces` in Stripes modules?


